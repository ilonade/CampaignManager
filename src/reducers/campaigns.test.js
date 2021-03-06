import {editCampaign} from "../actions/CampaignCRUD";
import {createCampaign} from "../actions/CampaignCRUD";
import CampaignsReducer from "./campaigns";
import {deleteCampaign} from "../actions/CampaignCRUD";
import {createReport} from "../actions/ReportCRUD";

describe("CampaignsReducer", () => {

    let firstCampaign = {title: "my first campaign"};
    let secondCampaign = {title: "my second campaign"};
    let thirdCampaign = {title: "my third campaign"};

    it("creates a new campaign", () => {
        let action = createCampaign(firstCampaign);
        let newState = CampaignsReducer(undefined, action);

        expect(newState.list.length).toEqual(1);
        expect(newState.list[0].title).toEqual(firstCampaign.title);
        expect(newState.list[0].id).toEqual(1);
    });

    it("creates a new campaign with reports", () => {
        let action = createCampaign(firstCampaign);
        let newState = CampaignsReducer(undefined, action);

        expect(newState.list.length).toEqual(1);
        expect(newState.list[0].title).toEqual(firstCampaign.title);
        expect(newState.list[0].id).toEqual(1);
        expect(newState.list[0].reports.list).toEqual([]);
        expect(newState.list[0].reports.maxId).toEqual(0);
    });

    it("creates two campaigns", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let action = createCampaign(secondCampaign);
        let newState = CampaignsReducer(state, action);

        expect(newState.list.length).toEqual(2);
        expect(newState.list[1].title).toEqual(secondCampaign.title);
        expect(newState.list[1].id).toEqual(2);
    });

    it("creates three campaigns", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let secondAction = createCampaign(secondCampaign);
        let secondState = CampaignsReducer(state, secondAction);

        let action = createCampaign(thirdCampaign);
        let newState = CampaignsReducer(secondState, action);

        expect(newState.list.length).toEqual(3);
        expect(newState.list[2].title).toEqual(thirdCampaign.title);
        expect(newState.list[2].id).toEqual(3);
    });

    it("edits one campaign", () => {
        let campaign = {title: "my first campaign"};
        let firstAction = createCampaign(campaign);
        let state = CampaignsReducer(undefined, firstAction);

        let campaignUpdate = {title: "my first edited campaign", id: 1};
        let action = editCampaign(campaignUpdate);
        let newState = CampaignsReducer(state, action);

        expect(newState.list.length).toEqual(1);
        expect(newState.list[0].title).toEqual(campaignUpdate.title);
        expect(newState.list[0].id).toEqual(1);
    });

    it("edits one campaign from three campaigns", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let secondAction = createCampaign(secondCampaign);
        let secondState = CampaignsReducer(state, secondAction);

        let thirdAction = createCampaign(thirdCampaign);
        let thirdState = CampaignsReducer(secondState, thirdAction);

        let campaignUpdate = {title: "my third edited campaign", id: 3};
        let action = editCampaign(campaignUpdate);
        let newState = CampaignsReducer(thirdState, action);

        expect(newState.list.length).toEqual(3);
        expect(newState.list[0].title).toEqual(firstCampaign.title);
        expect(newState.list[1].title).toEqual(secondCampaign.title);
        expect(newState.list[2].title).toEqual(campaignUpdate.title);
        expect(newState.list[2].id).toEqual(3);
    });

    it("edits one campaign and creates an another campaign", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let campaignEdit = {title: "my first edited campaign"};
        let secondAction = editCampaign(campaignEdit);
        let secondState = CampaignsReducer(state, secondAction);

        let action = createCampaign(secondCampaign);
        let newState = CampaignsReducer(secondState, action);

        expect(newState.list.length).toEqual(2);
        expect(newState.list[0].title).toEqual(firstCampaign.title);
        expect(newState.list[1].title).toEqual(secondCampaign.title);
        expect(newState.list[1].id).toEqual(2);
    });

    it("deletes one campaign and a user see an empty list of campaigns", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let action = deleteCampaign(1);
        let newState = CampaignsReducer(state, action);

        expect(newState.list).toEqual([]);
    });

    it("deletes the second campaign from a list of 3 campaigns", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let secondAction = createCampaign(secondCampaign);
        let secondState = CampaignsReducer(state, secondAction);

        let thirdAction = createCampaign(thirdCampaign);
        let thirdState = CampaignsReducer(secondState, thirdAction);

        let action = deleteCampaign(2);
        let newState = CampaignsReducer(thirdState, action);

        expect(newState.list.length).toEqual(2);
        expect(newState.list[0].title).toEqual(firstCampaign.title);
        expect(newState.list[1].title).toEqual(thirdCampaign.title);
    });

    it("handles reports actions also", () => {
        let firstAction = createCampaign(firstCampaign);
        let state = CampaignsReducer(undefined, firstAction);

        let report = {title: "a report"};
        let action = createReport(1, report);
        let newState = CampaignsReducer(state, action);

        let campaign = newState.list[0];
        expect(campaign.reports.list.length).toEqual(1);
        expect(campaign.reports.list[0].title).toEqual(report.title);
    });
});