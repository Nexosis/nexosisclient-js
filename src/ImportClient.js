import ApiClientBase from './ApiClientBase';

export default class ImportClient extends ApiClientBase {
    /**
     * Retrieve information about request to import data into Axon
     * 
     * @param {string} id - The id of the Import
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f30
     */
    get(id, transformFunc) {
        return this._apiConnection.get(`imports/${id}`, transformFunc);
    }

    /**
     * Import data into Axon from a file on Amazon S3
     * 
     * @param {string} dataSetName - the name to give to the dataset created by this import
     * @param {string} bucket - the S3 bucket name
     * @param {string} path - the path to the file to import in S3, often the filename
     * @param {string} region - the amazon region in which this bucket exists. 
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f2f
     * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions
     * */
    importFromS3(dataSetName, bucket, path, region, columns, transformFunc) {
        var payload = {
            DataSetName: dataSetName,
            Bucket: bucket,
            Path: path,
            Region: region,
            Columns: columns
        };

        return this._apiConnection.post('imports/s3', payload, transformFunc = undefined);
    }

    /**
     * Gets the list of imports that have been created for the company associated with your account
     * 
     * @param {string} dataSetName - optionally filter by dataset
     * @param {Date} requestedAfterDate - optionally filter by imports requested on or after this date
     * @param {Date} requestedBeforeDate - optionall filter by imports requested on or before this date
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f31
     */
    list(dataSetName = '', requestedAfterDate = '', requestedBeforeDate = '', transformFunc = undefined, page = 0, pageSize = 30) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        if (dataSetName) {
            Object.defineProperty(parameters, 'dataSetName', {
                value: dataSetName,
                enumerable: true
            });
        }

        if (requestedAfterDate) {
            Object.defineProperty(parameters, 'requestedAfterDate', {
                value: requestedAfterDate,
                enumerable: true
            });
        }

        if (requestedBeforeDate) {
            Object.defineProperty(parameters, 'requestedBeforeDate', {
                value: requestedBeforeDate,
                enumerable: true
            });
        }

        return this._apiConnection.get('imports', transformFunc, parameters);
    }
}