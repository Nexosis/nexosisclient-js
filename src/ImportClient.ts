import ApiClientBase from './ApiClientBase';
import { ImportDetailQuery, Authentication } from './Types';
import { formatDate } from './Util';

export default class ImportClient extends ApiClientBase {

    /**
     * Retrieve information about request to import data into Axon
     * 
     * @param {string} id - The id of the Import
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f30
     */
    get(id: string) {
        return this._apiConnection.get(`imports/${id}`, this.FetchTransformFunction);
    }

    /**
     * Import data into Axon from a file on Amazon S3
     * 
     * @param {string} dataSetName - the name to give to the dataset created by this import
     * @param {string} bucket - the S3 bucket name
     * @param {string} path - the path to the file to import in S3, often the filename
     * @param {string} region - the amazon region in which this bucket exists. 
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @return {Promise<object,any>} - information about the import and status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f2f
     * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions
     * */
    importFromS3(dataSetName: string, bucket: string, path: string, region: string, columns?: object) {
        var payload = {
            DataSetName: dataSetName,
            Bucket: bucket,
            Path: path,
            Region: region,
            Columns: columns
        };

        return this._apiConnection.post('imports/s3', payload, this.FetchTransformFunction);
    }

    /**
     * 
     * @param {string} dataSetName - The name to give to the dataset created by this import
     * @param {string} url - The url to import a file from 
     * @param {string} authentication - Optional authentication credentials to use when importing the file 
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a68
     */
    importFromUrl(dataSetName: string, url: string, authentication?: Authentication, columns?: object) {
        let payload = {
            DataSetName: dataSetName,
            Url: url,
            Columns: columns
        };

        if (authentication) {
            Object.assign(payload, { Auth: { Basic: authentication } });
        }

        return this._apiConnection.post('imports/url', payload, this.FetchTransformFunction);
    }

    /**
     * 
     * @param {string} dataSetName - The name to give to the dataset created by this import
     * @param {string} url - The url to import a file from 
     * @param {string} authentication - Optional authentication credentials to use when importing the file 
     * @param {object} columns - metadata definition for columns found in this dataset. optional. Follows schema for columns ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a67
     */
    importFromAzure(dataSetName: string, connectionString: string, container: string, blob: string, columns?: object) {
        let payload = {
            DataSetName: dataSetName,
            ConnectionString: connectionString,
            Container: container,
            Blob: blob,
            Columns: columns
        };

        return this._apiConnection.post('imports/azure', payload, this.FetchTransformFunction);
    }

    /**
     * Gets the list of imports that have been created for the company associated with your account
     * 
     * @param {object} query - optional query object used to filter the results
     * @param {number} page - page of results to retrieve, defaults to first page = 0
     * @param {number} pageSize - how many results per page, defaults to 50
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/595ce629e0ef6e0c98d37f31
     */
    list(query?: ImportDetailQuery, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
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
        }
        return this._apiConnection.get('imports', this.FetchTransformFunction, parameters);
    }
}