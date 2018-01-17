import ModelClient from '../src/ModelClient';
import SessionClient from '../src/SessionClient';
import DataSetClient from '../src/DataSetClient';
import { mochaAsync, sleep, isComplete } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const housingData = require('./fixtures/housing-data.json');

describe('Model Client', () => {
    let client: ModelClient;
    let dataClient: DataSetClient;
    let sessionClient: SessionClient;

    before(mochaAsync(async () => {
        client = new ModelClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
        sessionClient = new SessionClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
        dataClient = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });

        await dataClient.create('js-housing-data', housingData);
    }));

    after(mochaAsync(async () => {
        await dataClient.remove('js-housing-data');
    }));

    describe('basic usage', () => {
        let modelId;

        it('can build a model', mochaAsync(async () => {
            const session = await sessionClient.trainModel('js-housing-data', 'regression', 'SalePrice');

            let status = await sessionClient.status(session.sessionId);

            while (!isComplete(status)) {
                status = await sessionClient.status(session.sessionId);
                await sleep(30000);
            }

            const sessionDetails = await sessionClient.get(session.sessionId);
            expect(sessionDetails.modelId).not.to.be.empty;
            modelId = sessionDetails.modelId;
        })).timeout(900000); //15 minute timeout.

        it('can build a model with options', mochaAsync(async () => {
            const result = await sessionClient.trainModel({
                dataSourceName: 'js-housing-data',
                predictionDomain: 'regression',
                targetColumn: 'SalePrice'
            });

            expect(result.dataSourceName).to.equal('js-housing-data');
        }));

        it('can list the model that was created', mochaAsync(async () => {
            const result = await client.list({ dataSourceName: 'js-housing-data' });

            expect(result.items).to.have.lengthOf(1);
        }));

        it('can get details about a model', mochaAsync(async () => {
            const details = await client.get(modelId);

            expect(details.modelId).to.equal(modelId);
            expect(details.dataSourceName.startsWith('js-housing-data')).to.be.true;
        }));

        it('can get a prediction', mochaAsync(async () => {
            const predictResults = await client.predict(modelId, predictValue);

            expect(predictResults.data[0].SalePrice).not.to.be.undefined;
        }));

        it('can delete the model', mochaAsync(async () => {
            await client.remove(modelId);
        }));
    });

    describe('invalid models cases', () => {
        const modelId = '015ee297-af57-47b1-a33c-1d489cba24dd';
        it("can't get details of an unknown model", (done) => {
            client.get(modelId).then(() => {
                done('expected failure');
            }).catch(err => {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal(`Item of type model with identifier ${modelId} was not found`);
                done();
            });
        });

        it("can't delete unknown model", (done) => {
            client.remove(modelId).then(() => {
                done('expected failure');
            }).catch(err => {
                expect(err.status).to.equal(404);
                done();
            });
        });

        it("can't get a prediction from an unknown model", (done) => {
            client.predict(modelId, predictValue).then(() => {
                done('expected failure');
            }).catch(err => {
                expect(err.statusCode).to.equal(404);
                expect(err.message).to.equal(`Item of type model with identifier ${modelId} was not found`);
                done();
            });
        });
    });
}).timeout(10000);

const predictValue = [{
    "LotFrontage": 80,
    "LotArea": 9600,
    "LotShape": 4,
    "LandSlope": 3,
    "OverallQual": 6,
    "OverallCond": 8,
    "YearBuilt": 1976,
    "YearRemodAdd": 1976,
    "MasVnrArea": 0,
    "ExterQual": 3,
    "ExterCond": 3,
    "BsmtQual": 4,
    "BsmtCond": 3,
    "BsmtExposure": 4,
    "BsmtFinSF1": 978,
    "BsmtFinSF2": 0,
    "BsmtUnfSF": 284,
    "TotalBsmtSF": 1262,
    "HeatingQC": 5,
    "X1stFlrSF": 1262,
    "X2ndFlrSF": 0,
    "LowQualFinSF": 0,
    "GrLivArea": 1262,
    "BsmtFullBath": 0,
    "BsmtHalfBath": 1,
    "FullBath": 2,
    "HalfBath": 0,
    "BedroomAbvGr": 3,
    "KitchenAbvGr": 1,
    "KitchenQual": 3,
    "TotRmsAbvGrd": 6,
    "Fireplaces": 1,
    "FireplaceQu": 3,
    "GarageYrBlt": 1976,
    "GarageFinish": 2,
    "GarageCars": 2,
    "GarageArea": 460,
    "GarageQual": 3,
    "GarageCond": 3,
    "WoodDeckSF": 298,
    "OpenPorchSF": 0,
    "EnclosedPorch": 0,
    "X3SsnPorch": 0,
    "ScreenPorch": 0,
    "PoolArea": 0,
    "PoolQC": 0,
    "MiscVal": 0,
    "MoSold": 5,
    "YrSold": 2007,
    "MSSubClass_1": 0,
    "MSSubClass_2": 1,
    "MSSubClass_3": 0,
    "MSSubClass_4": 0,
    "MSSubClass_5": 0,
    "MSSubClass_6": 0,
    "MSSubClass_7": 0,
    "MSSubClass_8": 0,
    "MSSubClass_9": 0,
    "MSSubClass_10": 0,
    "MSSubClass_11": 0,
    "MSSubClass_12": 0,
    "MSSubClass_13": 0,
    "MSSubClass_14": 0,
    "MSSubClass_15": 0,
    "MSZoningRL": 1,
    "MSZoningRM": 0,
    "MSZoningC..all.": 0,
    "MSZoningFV": 0,
    "MSZoningRH": 0,
    "StreetPave": 1,
    "StreetGrvl": 0,
    "AlleyNone": 1,
    "AlleyGrvl": 0,
    "AlleyPave": 0,
    "LotShapeReg": 1,
    "LotShapeIR1": 0,
    "LotShapeIR2": 0,
    "LotShapeIR3": 0,
    "LandContourLvl": 1,
    "LandContourBnk": 0,
    "LandContourLow": 0,
    "LandContourHLS": 0,
    "UtilitiesAllPub": 1,
    "UtilitiesNoSeWa": 0,
    "LotConfigInside": 0,
    "LotConfigFR2": 1,
    "LotConfigCorner": 0,
    "LotConfigCulDSac": 0,
    "LotConfigFR3": 0,
    "LandSlopeGtl": 1,
    "LandSlopeMod": 0,
    "LandSlopeSev": 0,
    "NeighborhoodCollgCr": 0,
    "NeighborhoodVeenker": 1,
    "NeighborhoodCrawfor": 0,
    "NeighborhoodNoRidge": 0,
    "NeighborhoodMitchel": 0,
    "NeighborhoodSomerst": 0,
    "NeighborhoodNWAmes": 0,
    "NeighborhoodOldTown": 0,
    "NeighborhoodBrkSide": 0,
    "NeighborhoodSawyer": 0,
    "NeighborhoodNridgHt": 0,
    "NeighborhoodNAmes": 0,
    "NeighborhoodSawyerW": 0,
    "NeighborhoodIDOTRR": 0,
    "NeighborhoodMeadowV": 0,
    "NeighborhoodEdwards": 0,
    "NeighborhoodTimber": 0,
    "NeighborhoodGilbert": 0,
    "NeighborhoodStoneBr": 0,
    "NeighborhoodClearCr": 0,
    "NeighborhoodNPkVill": 0,
    "NeighborhoodBlmngtn": 0,
    "NeighborhoodBrDale": 0,
    "NeighborhoodSWISU": 0,
    "NeighborhoodBlueste": 0,
    "Condition1Norm": 0,
    "Condition1Feedr": 1,
    "Condition1PosN": 0,
    "Condition1Artery": 0,
    "Condition1RRAe": 0,
    "Condition1RRNn": 0,
    "Condition1RRAn": 0,
    "Condition1PosA": 0,
    "Condition1RRNe": 0,
    "Condition2Norm": 1,
    "Condition2Artery": 0,
    "Condition2RRNn": 0,
    "Condition2Feedr": 0,
    "Condition2PosN": 0,
    "Condition2PosA": 0,
    "Condition2RRAn": 0,
    "Condition2RRAe": 0,
    "BldgType1Fam": 1,
    "BldgType2fmCon": 0,
    "BldgTypeDuplex": 0,
    "BldgTypeTwnhsE": 0,
    "BldgTypeTwnhs": 0,
    "HouseStyle2Story": 0,
    "HouseStyle1Story": 1,
    "HouseStyle1.5Fin": 0,
    "HouseStyle1.5Unf": 0,
    "HouseStyleSFoyer": 0,
    "HouseStyleSLvl": 0,
    "HouseStyle2.5Unf": 0,
    "HouseStyle2.5Fin": 0,
    "RoofStyleGable": 1,
    "RoofStyleHip": 0,
    "RoofStyleGambrel": 0,
    "RoofStyleMansard": 0,
    "RoofStyleFlat": 0,
    "RoofStyleShed": 0,
    "RoofMatlCompShg": 1,
    "RoofMatlWdShngl": 0,
    "RoofMatlMetal": 0,
    "RoofMatlWdShake": 0,
    "RoofMatlMembran": 0,
    "RoofMatlTar.Grv": 0,
    "RoofMatlRoll": 0,
    "RoofMatlClyTile": 0,
    "Exterior1stVinylSd": 0,
    "Exterior1stMetalSd": 1,
    "Exterior1stWd.Sdng": 0,
    "Exterior1stHdBoard": 0,
    "Exterior1stBrkFace": 0,
    "Exterior1stWdShing": 0,
    "Exterior1stCemntBd": 0,
    "Exterior1stPlywood": 0,
    "Exterior1stAsbShng": 0,
    "Exterior1stStucco": 0,
    "Exterior1stBrkComm": 0,
    "Exterior1stAsphShn": 0,
    "Exterior1stStone": 0,
    "Exterior1stImStucc": 0,
    "Exterior1stCBlock": 0,
    "Exterior2ndVinylSd": 0,
    "Exterior2ndMetalSd": 1,
    "Exterior2ndWd.Shng": 0,
    "Exterior2ndHdBoard": 0,
    "Exterior2ndPlywood": 0,
    "Exterior2ndWd.Sdng": 0,
    "Exterior2ndCmentBd": 0,
    "Exterior2ndBrkFace": 0,
    "Exterior2ndStucco": 0,
    "Exterior2ndAsbShng": 0,
    "Exterior2ndBrk.Cmn": 0,
    "Exterior2ndImStucc": 0,
    "Exterior2ndAsphShn": 0,
    "Exterior2ndStone": 0,
    "Exterior2ndOther": 0,
    "Exterior2ndCBlock": 0,
    "MasVnrTypeBrkFace": 0,
    "MasVnrTypeNone": 1,
    "MasVnrTypeStone": 0,
    "MasVnrTypeBrkCmn": 0,
    "ExterQualGd": 0,
    "ExterQualTA": 1,
    "ExterQualEx": 0,
    "ExterQualFa": 0,
    "ExterCondTA": 1,
    "ExterCondGd": 0,
    "ExterCondFa": 0,
    "ExterCondPo": 0,
    "ExterCondEx": 0,
    "FoundationPConc": 0,
    "FoundationCBlock": 1,
    "FoundationBrkTil": 0,
    "FoundationWood": 0,
    "FoundationSlab": 0,
    "FoundationStone": 0,
    "BsmtQualGd": 1,
    "BsmtQualTA": 0,
    "BsmtQualEx": 0,
    "BsmtQualNone": 0,
    "BsmtQualFa": 0,
    "BsmtCondTA": 1,
    "BsmtCondGd": 0,
    "BsmtCondNone": 0,
    "BsmtCondFa": 0,
    "BsmtCondPo": 0,
    "BsmtExposureNo": 0,
    "BsmtExposureGd": 1,
    "BsmtExposureMn": 0,
    "BsmtExposureAv": 0,
    "BsmtExposureNone": 0,
    "BsmtFinType1GLQ": 0,
    "BsmtFinType1ALQ": 1,
    "BsmtFinType1Unf": 0,
    "BsmtFinType1Rec": 0,
    "BsmtFinType1BLQ": 0,
    "BsmtFinType1None": 0,
    "BsmtFinType1LwQ": 0,
    "BsmtFinType2Unf": 1,
    "BsmtFinType2BLQ": 0,
    "BsmtFinType2None": 0,
    "BsmtFinType2ALQ": 0,
    "BsmtFinType2Rec": 0,
    "BsmtFinType2LwQ": 0,
    "BsmtFinType2GLQ": 0,
    "HeatingGasA": 1,
    "HeatingGasW": 0,
    "HeatingGrav": 0,
    "HeatingWall": 0,
    "HeatingOthW": 0,
    "HeatingFloor": 0,
    "HeatingQCEx": 1,
    "HeatingQCGd": 0,
    "HeatingQCTA": 0,
    "HeatingQCFa": 0,
    "HeatingQCPo": 0,
    "CentralAirY": 1,
    "CentralAirN": 0,
    "ElectricalSBrkr": 1,
    "ElectricalFuseF": 0,
    "ElectricalFuseA": 0,
    "ElectricalFuseP": 0,
    "ElectricalMix": 0,
    "KitchenQualGd": 0,
    "KitchenQualTA": 1,
    "KitchenQualEx": 0,
    "KitchenQualFa": 0,
    "FunctionalTyp": 1,
    "FunctionalMin1": 0,
    "FunctionalMaj1": 0,
    "FunctionalMin2": 0,
    "FunctionalMod": 0,
    "FunctionalMaj2": 0,
    "FunctionalSev": 0,
    "FireplaceQuNone": 0,
    "FireplaceQuTA": 1,
    "FireplaceQuGd": 0,
    "FireplaceQuFa": 0,
    "FireplaceQuEx": 0,
    "FireplaceQuPo": 0,
    "GarageTypeAttchd": 1,
    "GarageTypeDetchd": 0,
    "GarageTypeBuiltIn": 0,
    "GarageTypeCarPort": 0,
    "GarageTypeNone": 0,
    "GarageTypeBasment": 0,
    "GarageType2Types": 0,
    "GarageFinishRFn": 1,
    "GarageFinishUnf": 0,
    "GarageFinishFin": 0,
    "GarageFinishNone": 0,
    "GarageQualTA": 1,
    "GarageQualFa": 0,
    "GarageQualGd": 0,
    "GarageQualNone": 0,
    "GarageQualEx": 0,
    "GarageQualPo": 0,
    "GarageCondTA": 1,
    "GarageCondFa": 0,
    "GarageCondNone": 0,
    "GarageCondGd": 0,
    "GarageCondPo": 0,
    "GarageCondEx": 0,
    "PavedDriveY": 1,
    "PavedDriveN": 0,
    "PavedDriveP": 0,
    "PoolQCNone": 1,
    "PoolQCEx": 0,
    "PoolQCFa": 0,
    "PoolQCGd": 0,
    "FenceNone": 1,
    "FenceMnPrv": 0,
    "FenceGdWo": 0,
    "FenceGdPrv": 0,
    "FenceMnWw": 0,
    "MiscFeatureNone": 1,
    "MiscFeatureShed": 0,
    "MiscFeatureGar2": 0,
    "MiscFeatureOthr": 0,
    "MiscFeatureTenC": 0,
    "SaleTypeWD": 1,
    "SaleTypeNew": 0,
    "SaleTypeCOD": 0,
    "SaleTypeConLD": 0,
    "SaleTypeConLI": 0,
    "SaleTypeCWD": 0,
    "SaleTypeConLw": 0,
    "SaleTypeCon": 0,
    "SaleTypeOth": 0,
    "SaleConditionNormal": 1,
    "SaleConditionAbnorml": 0,
    "SaleConditionPartial": 0,
    "SaleConditionAdjLand": 0,
    "SaleConditionAlloca": 0,
    "SaleConditionFamily": 0,
    "OverallCond1": 0,
    "OverallCond2": 0,
    "OverallCond3": 0,
    "OverallCond4": 0,
    "OverallCond5": 0,
    "OverallCond6": 0,
    "OverallCond7": 0,
    "OverallCond8": 1,
    "OverallCond9": 0,
    "OverallCond10": 0,
    "OverallQual1": 0,
    "OverallQual2": 0,
    "OverallQual3": 0,
    "OverallQual4": 0,
    "OverallQual5": 0,
    "OverallQual6": 1,
    "OverallQual7": 0,
    "OverallQual8": 0,
    "OverallQual9": 0,
    "OverallQual10": 0
}];