import { stringify } from "json5";
import { getLocalStoredUserData } from "./LocalStorageService";
import { delApi, deleteApi, post } from "./RestClient";
import axios from "axios";
import { MIME_TYPE } from "@/utils/app.config";
const authToken = process.env.NEXT_PUBLIC_AUTH_API_TOKEN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { v4 as uuidv4 } from "uuid";

const userId = getLocalStoredUserData();
// const userInfo = JSON.parse(userData);
// console.log(userInfo?.userId);

const defaultReqBody = {
  request: {
    filters: {
      createdBy: userId || "5afb0c71-5e85-46f6-8780-3059cbb7bbf9",
      primaryCategory: [
        "Course Assessment",
        "eTextbook",
        "Explanation Content",
        "Learning Resource",
        "Practice Question Set",
        "Teacher Resource",
        "Exam Question",
        "Content Playlist",
        "Course",
        "Digital Textbook",
        "Question paper",
      ],
    },
    // query: "",
    sort_by: {
      lastUpdatedOn: "desc",
    },
  },
};

const getReqBodyWithStatus = (
  status: string[],
  query: string,
  limit: number,
  offset: number
) => {
  return {
    ...defaultReqBody,
    request: {
      ...defaultReqBody.request,
      filters: {
        ...defaultReqBody.request.filters,
        status,
      },
      query,
      limit,
      offset,
    },
  };
};

export const getContent = async (
  status: string[],
  query: string,
  limit: number,
  offset: number
) => {
  const apiURL = "/action/composite/v3/search";
  try {
    const reqBody = getReqBodyWithStatus(status, query, limit, offset);
    const response = await post(apiURL, reqBody);
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

export const createQuestionSet = async () => {
  const apiURL = `/action/questionset/v2/create`;
  const reqBody = {
    request: {
      questionset: {
        name: "Untitled QuestionSet",
        mimeType: "application/vnd.sunbird.questionset",
        primaryCategory: "Practice Question Set",
        code: "de1508e3-cd30-48ba-b4de-25a98d8cfdd2",
        createdBy: userId || "5afb0c71-5e85-46f6-8780-3059cbb7bbf9",
      },
    },
  };

  try {
    const response = await axios.post(apiURL, reqBody, {
      headers: {
        "Content-Type": "application/json",
        tenantId: "ef99949b-7f3a-4a5f-806a-e67e683e38f3",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContent = async (identifier: string, mimeType: string) => {
  const questionsetRetireURL = `/action/questionset/v2/retire/${identifier}`;
  const contentRetireURL = `/action/content/v3/retire/${identifier}`;
  let apiURL = "";
  if (mimeType === MIME_TYPE.QUESTIONSET_MIME_TYPE) {
    apiURL = questionsetRetireURL;
  } else if (
    mimeType !== MIME_TYPE.QUESTIONSET_MIME_TYPE &&
    mimeType !== MIME_TYPE.COLLECTION_MIME_TYPE
  ) {
    apiURL = contentRetireURL;
  }
  try {
    const response = await delApi(apiURL); // Assuming you have a 'del' method that handles DELETE
    return response?.data?.result;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (userId: any) => {
  const apiURL = `/action/content/v3/create`;

  const reqBody = {
    request: {
      content: {
        code: uuidv4(), // Generate a unique ID for 'code'
        name: "Untitled Course",
        description: "Enter description for Course",
        createdBy: userId || "bcb1050b-1967-4a04-8da2-df3ed9d282d4",
        createdFor: ["test-k12-channel"],
        mimeType: MIME_TYPE.COURSE_MIME_TYPE,

        resourceType: "Course",
        primaryCategory: "Course",
        contentType: "Course",
      },
    },
  };

  try {
    const response = await axios.post(apiURL, reqBody, {});
    return response?.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const publishContent = async (identifier: any) => {
  try {
    const response = await axios.post("/api/publish", { identifier });
    return response.data;
  } catch (error) {
    console.error("Error during publishing:", error);
    throw error;
  }
};

export const submitComment = async (identifier: any, comment: any) => {
  try {
    const response = await axios.post("/api/submit-comment", {
      identifier,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting comment:", error);
    throw error;
  }
};
