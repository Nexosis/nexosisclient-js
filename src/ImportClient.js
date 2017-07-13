import ApiClientBase from './ApiClientBase';

export default class ImportClient extends ApiClientBase
{
    get(id, transformFunc){
        return this._apiConnection.get(`imports/${id}`,transformFunc);
    }

    importFromS3(dataSetName, bucket, path, region, columns, transformFunc){
        var payload = {
            DataSetName: dataSetName,
            Bucket: bucket,
            Path: path,
            Region: region,
            Columns, columns
        };

        return this._apiConnection.post('imports/s3',payload,transformFunc);
    }

    list(dataSetName, requestedAfterDate, requestedBeforeDate, transformFunc){
        var parameters = {
            dataSetName: dataSetName,
            requestedAfterDate: requestedAfterDate,
            requestedBeforeDate: requestedBeforeDate
        };

        return this._apiConnection.get('imports',transformFunc, parameters);
    }
}