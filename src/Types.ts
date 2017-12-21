
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

export interface ImportDetailQuery {
    dataSetName?: string,
    requestedBeforeDate?: Date | string,
    requestedAfterDate?: Date | string
}

export interface ModelSummaryQuery {
    dataSourceName?: string,
    createdAfterDate?: Date | string,
    createdBeforeDate?: Date | string,
}

export interface SessionListQuery extends ImportDetailQuery {
    eventName?: string
}

export interface ViewDetailQuery {
    viewPartialName?: string,
    dataSetName?: string
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

export type PredictionDomain = 'regression' | 'classification' | 'forecast' | 'impact';