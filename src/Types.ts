export interface ListQueryable {
    sortBy?: string,
    sortOrder?: SortOrder,
    page?: number,
    pageSize?: number
}

export interface DataSetListQuery extends ListQueryable {
    partialName?: string
}

export interface DataSetDataQuery {
    startDate?: Date,
    endDate?: Date,
    include?: Array<string>
}

export interface DataSetData {
    data: Array<any>,
    columns?: Array<any>
}

export interface DataSetRemoveCriteria {
    startDate?: Date | string,
    endDate?: Date | string,
    cascade?: Array<DataSetDeleteCascadeOptions>,
}

export interface ImportDetailQuery extends ListQueryable {
    dataSetName?: string,
    requestedBeforeDate?: Date | string,
    requestedAfterDate?: Date | string
}

export interface ModelSummaryQuery extends ListQueryable {
    dataSourceName?: string,
    createdAfterDate?: Date | string,
    createdBeforeDate?: Date | string,
}

export interface SessionListQuery extends ListQueryable {
    dataSourceName?: string,
    requestedBeforeDate?: Date | string,
    requestedAfterDate?: Date | string
    eventName?: string,
    modelId?: string
}

export interface ViewDetailQuery {
    viewPartialName?: string,
    dataSetName?: string
}

export interface VocabulariesQuery {
    createdFromSession? : string,
    dataSource?: string,
}

export interface VocabularyWordsQuery {
    type? : WordType
}

export type Authentication = BasicAuthentication

export interface BasicAuthentication {
    userId: string,
    password: string
}

export interface S3AccessKeys {
    accessKeyId: string
    secretAccessKey: string
}

export type ResultInterval = 'hour' | 'day' | 'week' | 'month' | 'year';

export type DataSetDeleteCascadeOptions = 'session' | 'view' | 'model';

export type PredictionDomain = 'regression' | 'classification' | 'forecast' | 'impact' | 'anomalies';

export type WordType = 'word' | 'stopWord';

export type SortOrder = 'asc' | 'desc';

export interface AnalyzeImpactOptions extends TimeSeriesSessionOptions {
    eventName: string,
}

export interface ForecastOptions extends TimeSeriesSessionOptions {
}

export interface TimeSeriesSessionOptions extends SessionOptions {
    startDate: Date | string,
    endDate: Date | string,
    resultInterval?: ResultInterval,
}

export interface ModelSessionOptions extends SessionOptions {
    predictionDomain: PredictionDomain,
    extraParameters?: SessionExtraParameters
}

export interface SessionOptions {
    dataSourceName: string,
    targetColumn?: string,
    columnMetadata?: object,
    statusCallbackUrl?: string
}

export type SessionExtraParameters = AnomaliesExtraParameters | ClassificationExtraParameters

export interface AnomaliesExtraParameters {
    containsAnomalies: boolean,
    [propName: string]: any
}

export interface ClassificationExtraParameters {
    balance: boolean,
    [propName: string]: any
}

export interface PredictionExtraParameters {
    includeClassScores: boolean,
    [propName: string]: any
}
