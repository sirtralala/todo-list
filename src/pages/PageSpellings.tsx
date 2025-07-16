import { useCustomerContext } from "capito-customer-specifics"
import { usePagination } from "capito-hooks"
import { useLocalSettingState, useProfileState } from "capito-hookstate"
import {
  AddSpellingsEntryInput,
  useSWRAddSpellingsEntry,
  useSWRDeleteSpellings,
  useSWRSpellings,
} from "capito-swr"
import {
  Client,
  CustomisationListItem,
  CustomisationListType,
  Locale,
} from "capito-types-local"
import {
  AlertBoxType,
  LoadingThreeDots,
  NotificationBox,
  Table,
  TableHead,
  TableSearchInput,
  useTranslationContext,
  XMarkIcon,
} from "capito-ui-basic"
import { getClient } from "capito-utilities"
import { useIsAllowedToModifyCustomisations } from "capito-web-hooks"
import * as React from "react"
import { JSX, useEffect, useState } from "react"
import { DeleteTableItemsButton } from "../components/Buttons/DeleteTableItemsButton"
import { ExportCsvButton } from "../components/Buttons/ExportCsvButton"
import { ImportCsvButton } from "../components/Buttons/ImportCsvButton"
import { ImportCsvExampleButton } from "../components/Buttons/ImportCsvExampleButton"
import { CsvImportExample } from "../components/Examples/CsvImportExample"
import { CustomisationExample } from "../components/Examples/CustomisationExample"
import { CsvImportInvalidNotification } from "../components/Notifications/CsvImportInvalidNotification"
import { CsvImportNotification } from "../components/Notifications/CsvImportNotification"
import { ReadOnlyNotification } from "../components/Notifications/ReadOnlyNotification"
import { AddItemRow } from "../components/Table/AddItemRow"
import { TableRow } from "../components/Table/TableRow"
import { exportCSV } from "../utilities/csvExport"
import {
  CsvImportError,
  getCustomisationListData,
} from "../utilities/csvImport"
import {
  getCustomisationLocale,
  getLocalTypedSpellingsEntries,
  isInputValid,
  localStorageKey,
} from "../utilities/data"

interface PageSpellingsProps {
  editedPhrases: CustomisationListItem[]
  setEditedPhrases: React.Dispatch<
    React.SetStateAction<CustomisationListItem[]>
  >
  notification: JSX.Element | undefined
  setNotification: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>
}

export const PageSpellings = ({
  editedPhrases,
  setEditedPhrases,
  notification,
  setNotification,
}: PageSpellingsProps) => {
  const maxWidth = "max-w-5xl"

  const { t } = useTranslationContext()
  const { profile } = useProfileState()
  const { analysisLanguage } = useLocalSettingState()
  const { isAllowedToModifyCustomisationsData, teamAdminEmails } =
    useIsAllowedToModifyCustomisations()
  const { customisationDropdownFilter } = useCustomerContext()

  const {
    data,
    isLoading: isLoadingEntries,
    errorText: errorTextLoading,
  } = useSWRSpellings(profile?.id)

  const {
    addSpellingsEntry,
    isLoading: isLoadingAdd,
    errorText: errorTextAdd,
  } = useSWRAddSpellingsEntry(profile?.id)

  const [deleteItemIds, setDeleteItemIds] = useState<string[]>([])
  const {
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    errorText: errorTextDelete,
    deleteSpellingsEntry,
  } = useSWRDeleteSpellings({
    accountId: profile?.id,
    entryIds: deleteItemIds,
  })

  const [rowsPerPage, setRowsPerPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [checkInput, setCheckInput] = useState<boolean>(false)
  const [checkEdit, setCheckEdit] = useState<boolean>(false)
  const [userEnquiryNotification, setUserEnquiryNotification] = useState<
    JSX.Element | undefined
  >(undefined)

  const [showCsvExample, setShowCsvExample] = useState<boolean>(false)
  const [csvData, setCsvData] = useState<string | undefined>(undefined)
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [similar, setSimilar] = useState<string[]>([])
  const [enableSimilarityCheck, setEnableSimilarityCheck] =
    useState<boolean>(true)

  const localStorageLanguages = localStorage
    .getItem(localStorageKey)
    ?.split(",") as Locale[]

  const [locales, setLocales] = useState<Locale[]>(
    localStorageLanguages?.length
      ? localStorageLanguages
      : [getCustomisationLocale(analysisLanguage)]
  )

  // phrases after each api request
  const [phrases, setPhrases] = useState<CustomisationListItem[]>([])

  // phrases displayed to the user after each local edit, BEFORE storing in backend
  const [filteredPhrases, setFilteredPhrases] = useState<
    CustomisationListItem[] | undefined
  >([])

  const [sortType, setSortType] = useState<string>("asc")

  const { displayedItems, tablePages } = usePagination({
    items: filteredPhrases,
    currentPage,
    rowsPerPage,
    sortType,
  })

  // process fetched spellings data
  useEffect(() => {
    if (data && data.length) {
      const localTypedItems = getLocalTypedSpellingsEntries(data, sortType)
      setPhrases(localTypedItems)
      setFilteredPhrases(localTypedItems)
      setRowsPerPage(localTypedItems.length > 10 ? 10 : localTypedItems.length)
    } else {
      setPhrases([])
      setFilteredPhrases([])
      setRowsPerPage(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // validate user input for new spellings entry
  useEffect(() => {
    if (!checkInput) {
      return
    }

    const inputErrors: JSX.Element[] = []
    if (!title.trim().length) {
      inputErrors.push(<li key='error-spelling'>{t("error-add-spelling")}</li>)
    } else if (title.length > 96) {
      inputErrors.push(
        <li key='error-spelling-length'>{t("error-add-spelling-too-long")}</li>
      )
    }
    if (!locales.length) {
      inputErrors.push(<li key='error-locale'>{t("error-add-locale")}</li>)
    }
    if (!enableSimilarityCheck && !similar.length) {
      inputErrors.push(<li key='error-similar'>{t("no-similar-phrase")}</li>)
    } else if (
      similar.length > 8 ||
      (similar.length === 8 && description.length)
    ) {
      inputErrors.push(
        <li key='error-too-many-similars'>{t("error-too-many-similars")}</li>
      )
    }
    if (inputErrors.length) {
      setNotification(
        <ul className='list-disc ml-4'>{inputErrors.map((error) => error)}</ul>
      )
    } else {
      setNotification(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, title, similar, locales, checkInput])

  // validate user input for edited spellings entry
  useEffect(() => {
    if (!checkEdit) {
      return
    }

    const invalidEditedPhrase = editedPhrases.find(
      (e) =>
        !isInputValid({
          tableType: CustomisationListType.SPELLINGS,
          title: e.title,
          locales: e.locales,
          description: e.description,
          similar: e.similar,
          enableSimilarityCheck: e.enableSimilarityCheck,
        })
    )
    if (!invalidEditedPhrase) {
      setNotification(undefined)
      return
    }

    const editErrors: JSX.Element[] = []
    if (!invalidEditedPhrase.title.trim().length) {
      editErrors.push(<li key='error-spelling'>{t("error-add-spelling")}</li>)
    } else if (invalidEditedPhrase.title.length > 96) {
      editErrors.push(
        <li key='error-spelling-length'>{t("error-add-spelling-too-long")}</li>
      )
    }
    if (!invalidEditedPhrase.locales.length) {
      editErrors.push(<li key='error-locale'>{t("error-add-locale")}</li>)
    }
    if (
      !invalidEditedPhrase.enableSimilarityCheck &&
      !invalidEditedPhrase.similar?.length
    ) {
      editErrors.push(<li key='error-locale'>{t("error-similarity-check")}</li>)
    }

    if (editErrors.length) {
      setNotification(
        <ul className='list-disc ml-4'>{editErrors.map((error) => error)}</ul>
      )
    } else {
      setNotification(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, editedPhrases, checkEdit])

  // render possible errorText after loading / manipulating data
  useEffect(() => {
    if (errorTextAdd || errorTextLoading || errorTextDelete) {
      const errorText = errorTextAdd || errorTextLoading || errorTextDelete
      setNotification(
        <div>
          <p>{t(errorText.headingTextKey)}</p>
          <p>{t(errorText.textKey)}</p>
        </div>
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorTextAdd, errorTextDelete, errorTextLoading, t])

  const onAddItem = (newItems: CustomisationListItem[]) => {
    const getSimilarItems = (item: CustomisationListItem) => {
      return {
        autodetect: item.enableSimilarityCheck,
        items:
          item.similar.length && item.similar[0].length
            ? item.similar.map((s) => {
                return { phrase: s }
              })
            : [],
      }
    }
    const addSpellingsItems: AddSpellingsEntryInput[] = []
    newItems.forEach((item) => {
      item.locales.forEach((loc) => {
        addSpellingsItems.push({
          phrase: item.title,
          locale: loc,
          similar: getSimilarItems(item),
        })
      })
    })
    addSpellingsEntry(addSpellingsItems)
    setSimilar([])
    setEnableSimilarityCheck(true)
  }

  useEffect(() => {
    if (deleteItemIds.length) {
      deleteSpellingsEntry({ shouldRefetch: editedPhrases.length === 0 })
      setNotification(undefined)
      setDeleteItemIds([])
    }
    if (isSuccessDelete && editedPhrases.length && !deleteItemIds.length) {
      onAddItem(editedPhrases)
      setEditedPhrases([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteItemIds, isSuccessDelete])

  // handle CSV import
  useEffect(() => {
    if (csvData === CsvImportError.notSupported) {
      setNotification(<p>{t("only-csv-allowed")}</p>)
      setCsvData(undefined)
      return
    }

    if (csvData) {
      const importedPhrases = getCustomisationListData(
        csvData,
        CustomisationListType.SPELLINGS,
        customisationDropdownFilter
      )

      if (!importedPhrases.valid.length) {
        setNotification(<p>{t("error-csv-p1")}</p>)
        setCsvData(undefined)
        return
      }

      if (importedPhrases.valid[0].locales[0] === t("text-language")) {
        importedPhrases.valid.shift()
      }

      if (importedPhrases.valid.length) {
        if (!phrases.length) {
          onAddItem(importedPhrases.valid)
          // for local testing without saving in backend: comment out "onAddItem" and comment in the commented out code
          /* setPhrases(importedPhrases.valid)
          setFilteredPhrases(importedPhrases.valid)
          setRowsPerPage(
            importedPhrases.valid.length > 10
              ? 10
              : importedPhrases.valid.length
          ) */
          setCsvData(undefined)

          if (importedPhrases.invalid.length) {
            setNotification(
              <CsvImportInvalidNotification
                tableType={CustomisationListType.SPELLINGS}
                importedInvalidPhrases={importedPhrases.invalid}
                phraseString={t("spellings")}
                descriptionString={t("similar-phrases")}
                setNotification={setNotification}
              />
            )
          }
          return
        }
        setUserEnquiryNotification(
          <CsvImportNotification
            tableType={CustomisationListType.SPELLINGS}
            phrases={phrases}
            importedPhrases={importedPhrases.valid}
            importedInvalidPhrases={importedPhrases.invalid}
            onAddItem={onAddItem}
            setDeleteItemIds={setDeleteItemIds}
            setEditedPhrases={setEditedPhrases}
            setCsvData={setCsvData}
            setNotification={setNotification}
            setCsvImportNotification={setUserEnquiryNotification}
          />
        )
        setCsvData(undefined)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvData, t])

  const onResetItem = (item: CustomisationListItem) => {
    const originalPhrase = phrases.find((p) => p.id === item.id)
    setFilteredPhrases((prevPhrases) =>
      prevPhrases.map((prev) => {
        if (prev.id === item.id) {
          return originalPhrase
        }
        return prev
      })
    )
    setEditedPhrases((prevPhrases) =>
      prevPhrases.filter((p) => p.id !== item.id)
    )
  }

  const renderNotification = () =>
    notification ? (
      <div className='w-1/4 mt-14 pl-4'>
        <NotificationBox type={AlertBoxType.ERROR} content={notification} />
      </div>
    ) : null

  const renderCSVImportExample = () =>
    showCsvExample ? (
      <div className='w-1/4 pl-4'>
        <NotificationBox
          type={AlertBoxType.SUCCESS}
          content={
            <CsvImportExample
              tableType={CustomisationListType.SPELLINGS}
              phraseString={t("spellings")}
              descriptionString={t("similar-phrases")}
              setShowCsvExample={setShowCsvExample}
            />
          }
        />
      </div>
    ) : null

  const renderCSVImportNotification = () =>
    userEnquiryNotification ? (
      <div className='w-1/4 mt-14 pl-4'>
        <NotificationBox
          type={AlertBoxType.SUCCESS}
          content={userEnquiryNotification}
        />
      </div>
    ) : null

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilteredPhrases(
      phrases.filter(
        (phrase) =>
          phrase.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          phrase.similar.find((p) =>
            p.toLowerCase().includes(e.target.value.toLowerCase())
          )
      )
    )

  const sortTableData = (colName: string, type: string) => {
    setSortType(type)
    setFilteredPhrases(
      filteredPhrases.sort((a, b) => {
        if (colName === t("spellings") && type === "asc") {
          return a.title.localeCompare(b.title)
        } else {
          return b.title.localeCompare(a.title)
        }
      })
    )
  }

  const tableHead: TableHead[] = [
    { title: t("spellings"), className: "w-60" },
    { title: t("text-language"), className: "w-40" },
    {
      title: `${t("similar-phrases")} (${t("optional")})`,
      className: "flex grow",
    },
    { title: t("actions"), className: "w-fit" },
  ]

  const addItemRow = (
    <AddItemRow
      key='add-item-element'
      tableType={CustomisationListType.SPELLINGS}
      phrases={phrases}
      title={title}
      setTitle={setTitle}
      locales={locales}
      setLocales={setLocales}
      description={description}
      setDescription={setDescription}
      similar={similar}
      setSimilar={setSimilar}
      enableSimilarityCheck={enableSimilarityCheck}
      setEnableSimilarityCheck={setEnableSimilarityCheck}
      readOnlyNotification={
        !isAllowedToModifyCustomisationsData && (
          <ReadOnlyNotification teamAdminEmails={teamAdminEmails} />
        )
      }
      setCheckInput={setCheckInput}
      setNotification={setNotification}
      onAddItem={onAddItem}
    />
  )

  const tableBody = displayedItems.map((item, i) => (
    <TableRow
      key={`item-element-${i}`}
      tableType={CustomisationListType.SPELLINGS}
      displayedItem={item}
      i={i + 1}
      setFilteredPhrases={setFilteredPhrases}
      editedPhrases={editedPhrases}
      setEditedPhrases={setEditedPhrases}
      setCheckEdit={setCheckEdit}
      setNotification={setNotification}
      setUserEnquiryNotification={setUserEnquiryNotification}
      onDeleteItem={setDeleteItemIds}
      onResetItem={onResetItem}
      readOnlyNotification={
        !isAllowedToModifyCustomisationsData && (
          <ReadOnlyNotification teamAdminEmails={teamAdminEmails} />
        )
      }
    />
  ))

  const renderAddSimilarList = () =>
    similar.map((s, i) => (
      <div
        key={`add-similar-${i}`}
        className='w-fit flex items-start my-1 rounded-md border border-color-neutral-light shadow-sm text-color-neutral focus-default'
      >
        <p className='px-1 py-0.5'>{s}</p>
        <button
          type='button'
          title={t("delete")}
          className='hover:text-color-capito'
          onClick={() => {
            if (similar.length === 1) {
              setEnableSimilarityCheck(true)
            }
            setSimilar((prev) => prev.filter((prev) => prev !== s))
          }}
        >
          <XMarkIcon strokeWidth='1.5' className='h-4 w-4' aria-hidden='true' />
        </button>
      </div>
    ))

  similar.length
    ? tableBody.unshift(
        <tr key='similar-row'>
          <td colSpan={4} className='h-fit pb-2 shadow-md'>
            <div key='similar-container' className='flex px-4 space-x-2'>
              {renderAddSimilarList()}
            </div>
          </td>
        </tr>
      )
    : null

  tableBody.unshift(
    isLoadingEntries || isLoadingAdd || isLoadingDelete ? (
      <tr key='loading-row'>
        <td colSpan={4} className='h-14 shadow-md'>
          <LoadingThreeDots />
        </td>
      </tr>
    ) : (
      addItemRow
    )
  )

  const onExportCSV = () => {
    if (phrases.length) {
      // export column names in English
      exportCSV({
        name: "Spelling", //t('spellings'),
        col1: "Spelling", //t('spellings'),
        col2: "Text language", //t('text-language'),
        col3: "Incorrect spelling", //t('similar-phrases'),
        col4: "Similarity check", //t('similarity-check'),
        items: phrases,
      })
    } else {
      setNotification(<p>{t("no-data-created")}</p>)
    }
  }

  const renderImportExportButtons = () => (
    <div className={`${maxWidth} flex justify-end`}>
      {isAllowedToModifyCustomisationsData && (
        <ImportCsvButton
          label={t("import-csv")}
          setCsvData={setCsvData}
          setNotification={setNotification}
          readOnlyNotification={
            !isAllowedToModifyCustomisationsData && (
              <ReadOnlyNotification teamAdminEmails={teamAdminEmails} />
            )
          }
        />
      )}
      <ExportCsvButton label={t("export-csv")} onExportCsv={onExportCSV} />
    </div>
  )

  const renderDeleteTableItemsButton = () => (
    <DeleteTableItemsButton
      isAllowedToManipulateData={isAllowedToModifyCustomisationsData}
      teamAdminEmails={teamAdminEmails}
      phrases={phrases}
      setDeleteItemIds={setDeleteItemIds}
      setNotification={setNotification}
      setUserEnquiryNotification={setUserEnquiryNotification}
      label={getClient() === Client.ERSTE && t("delete-spellings")}
    />
  )

  const renderTableArea = () => (
    <div className={`w-full flex`}>
      <div className={`${maxWidth} grow`}>
        <div className='pt-4 px-4 pb-2 rounded-md shadow'>
          <div className='flex justify-between'>
            <TableSearchInput
              placeholder={t("spellings-filter-placeholder")}
              className='mb-4'
              onChange={onSearchInput}
            />
            {renderImportExportButtons()}
          </div>
          <Table
            data={displayedItems}
            head={tableHead}
            body={tableBody}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            tablePages={tablePages}
            totalNumberOfItems={phrases.length}
            sortTableData={sortTableData}
            hideEmptyRows
          />
        </div>
        <div className={`${maxWidth} flex justify-end space-x-2 mt-4 pb-8`}>
          {isAllowedToModifyCustomisationsData && (
            <ImportCsvExampleButton
              label={showCsvExample ? t("hide-csv-hints") : t("show-csv-hints")}
              showCsvExample={showCsvExample}
              setShowCsvExample={setShowCsvExample}
            />
          )}
          {isAllowedToModifyCustomisationsData &&
            renderDeleteTableItemsButton()}
        </div>
      </div>
      {renderNotification()}
      {renderCSVImportExample()}
      {renderCSVImportNotification()}
    </div>
  )

  return (
    <div className='mr-8'>
      <CustomisationExample tableType={CustomisationListType.SPELLINGS} />
      {renderTableArea()}
    </div>
  )
}
