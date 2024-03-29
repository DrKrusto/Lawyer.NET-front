import { defineStore } from "pinia";
import { getLawyerResultBySearchTerm } from "@/services/LawyerService";
import { useErrorStore } from "@/stores/ErrorStore";
import {
  HttpErrorResponse,
  HttpSuccessResponse,
  isHttpSuccessResponse,
} from "@/models/HttpResponses/HttpResponse";
import LawyerSearchResult from "@/models/LawyerSearchResult";
import LawyerSearchModel from "@/models/LawyerSearchModel";

const config = require("@/config/api-config.json");

const getAuthToken = () => localStorage.getItem("access_token");

export const useSearchStore = defineStore("searchStore", {
  state: () => ({
    lawyerSearchResult: {
      results: [] as LawyerSearchModel[],
      totalCount: 0,
      totalPages: 0,
      page: 0,
    } as LawyerSearchResult,
  }),
  actions: {
    async searchLawyers(searchTerm: string, page: number) {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await getLawyerResultBySearchTerm(
          searchTerm,
          page,
          config.NUMBER_OF_RESULTS_PER_PAGE,
          token
        );
        if (isHttpSuccessResponse(response)) {
          const success = response as HttpSuccessResponse<LawyerSearchResult>;
          this.lawyerSearchResult = success.data;
          return;
        }
        const error = response as HttpErrorResponse;
        useErrorStore().showError(error.message, error.details);
      }
    },
  },
});
