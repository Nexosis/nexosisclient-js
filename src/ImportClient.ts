import ApiClientBase from './ApiClientBase';
import { ImportDetailQuery, Authentication, S3AccessKeys } from './Types';
import { formatDate, addListQueryParameters } from './Util';

export default class ImportClient extends ApiClientBase {

    /**
     * Retrieve information about an import request
     * 
     * @param {string} id - The id of the Import
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f30
     */
    get(id: string) {
        return this._apiConnection.get(`imports/${id}`, this.FetchTransformFunction);
    }

    /**
     * Import a file from Amazon S3 into a dataset.  Files can be either CSV or JSON, and can be gzipped.
     * 
     * @param {string} dataSetName - the name to give to the dataset created by this import
     * @param {string} bucket - the S3 bucket name
     * @param {string} path - the path to the file to import in S3, often the filename
     * @param {string} region - the amazon region in which this bucket exists. 
     * @param {object} accessKeys - optional access keys used to access the file. { 'accessKeyId':'key', 'secretAccessKey':'secretKey' }.
     * @param {string} contentType - Optional value of 'json' or 'csv'. Nexosis will automatically attempt to figure out the type of content if not provided.
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f2f
     * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions
     * @see http://docs.nexosis.com/guides/importingdata
     * */
    importFromS3(dataSetName: string, bucket: string, path: string, region: string, accessKeys?: S3AccessKeys, contentType?: string, columns?: object) {
        var payload = {
            DataSetName: dataSetName,
            Bucket: bucket,
            Path: path,
            Region: region,
            ContentType: contentType,
            Columns: columns
        };

        if (accessKeys) {
            Object.assign(payload, accessKeys);
        }

        return this._apiConnection.post('imports/s3', payload, this.FetchTransformFunction);
    }

    /**
     * Import a file from a url into a dataset.  Urls can return either CSV or JSON, and can be gzipped.
     * 
     * @param {string} dataSetName - The name to give to the dataset created by this import
     * @param {string} url - The url to import a file from 
     * @param {string} authentication - Optional authentication credentials to use when importing the file 
     * @param {string} contentType - Optional value of 'json' or 'csv'. Nexosis will automatically attempt to figure out the type of content if not provided.
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a68
     * @see http://docs.nexosis.com/guides/importingdata
     */
    importFromUrl(dataSetName: string, url: string, authentication?: Authentication, contentType?: string, columns?: object) {
        let payload = {
            DataSetName: dataSetName,
            Url: url,
            ContentType: contentType,
            Columns: columns
        };

        if (authentication) {
            Object.assign(payload, { Auth: { Basic: authentication } });
        }

        return this._apiConnection.post('imports/url', payload, this.FetchTransformFunction);
    }

    /**
     * Import a file from Azure into a dataset.  Files can be either CSV or JSON, and can be gzipped.
     * 
     * @param {string} dataSetName - The name to give to the dataset created by this import
     * @param {string} url - The url to import a file from 
     * @param {string} authentication - Optional authentication credentials to use when importing the file 
     * @param {string} contentType - Optional value of 'json' or 'csv'. Nexosis will automatically attempt to figure out the type of content if not provided.
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a67
     * @see http://docs.nexosis.com/guides/importingdata
     */
    importFromAzure(dataSetName: string, connectionString: string, container: string, blob: string, contentType?: string, columns?: object) {
        let payload = {
            DataSetName: dataSetName,
            ConnectionString: connectionString,
            Container: container,
            Blob: blob,
            ContentType: contentType,
            Columns: columns
        };

        return this._apiConnection.post('imports/azure', payload, this.FetchTransformFunction);
    }

    /**
     * Gets the list of imports that have been created for the company associated with your account
     * 
     * @param {object} query - optional query object used to filter the results
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f31
     */
    list(query?: ImportDetailQuery) {
        var parameters = {};
        if (query) {
            if (query.dataSetName) {
                Object.defineProperty(parameters, 'dataSetName', {
                    value: query.dataSetName,
                    enumerable: true
                });
            }

            if (query.requestedAfterDate) {
                Object.defineProperty(parameters, 'requestedAfterDate', {
                    value: formatDate(query.requestedAfterDate),
                    enumerable: true
                });
            }

            if (query.requestedBeforeDate) {
                Object.defineProperty(parameters, 'requestedBeforeDate', {
                    value: formatDate(query.requestedBeforeDate),
                    enumerable: true
                });
            }

            addListQueryParameters(query, parameters);
        }
        return this._apiConnection.get('imports', this.FetchTransformFunction, parameters);
    }
}