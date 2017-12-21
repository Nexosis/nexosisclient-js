
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
    cascade?: string,
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