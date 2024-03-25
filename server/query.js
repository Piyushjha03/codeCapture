// get global data
const globaldata = `query globalData {
    feature {
      questionTranslation
      subscription
      signUp
      discuss
      mockInterview
      contest
      store
      chinaProblemDiscuss
      socialProviders
      studentFooter
      enableChannels
      dangerZone
      enableSharedWorker
      enableRecaptchaV3
      enableDebugger
      enableDebuggerPremium
      enableAutocomplete
      enableAutocompletePremium
      enableAllQuestionsRaw
      autocompleteLanguages
      enableIndiaPricing
      enableReferralDiscount
      maxTimeTravelTicketCount
      enableStoreShippingForm
      enableCodingChallengeV2
      __typename
    }
    streakCounter {
      streakCount
      daysSkipped
      currentDayCompleted
      __typename
    }
    currentTimestamp
    userStatus {
      isSignedIn
      isAdmin
      isStaff
      isSuperuser
      isMockUser
      isTranslator
      isPremium
      isVerified
      checkedInToday
      username
      realName
      avatar
      optedIn
      requestRegion
      region
      activeSessionId
      permissions
      notificationStatus {
        lastModified
        numUnread
        __typename
      }
      completedFeatureGuides
      __typename
    }
    siteRegion
    chinaHost
    websocketUrl
    recaptchaKey
    recaptchaKeyV2
    sitewideAnnouncement
    userCountryCode
  }`;
// problemsetQuestionList
const problemsetQuestionList = `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        freqBar
        frontendQuestionId: questionFrontendId
        isFavor
        paidOnly: isPaidOnly
        status
        title
        titleSlug
        topicTags {
          name
          id
          slug
        }
        hasSolution
        hasVideoSolution
      }
    }
  }`;
// get problem content
const getProblemContent = `query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
      mysqlSchemas
    }
  }`;
// get initial code editor data
const questionEditorData = `query questionEditorData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    codeSnippets {
      lang
      langSlug
      code
    }
    envInfo
    enableRunCode
  }
}`;
// get test case data
const getTestCaseDataQuery = `query consolePanelConfig($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    questionTitle
    enableDebugger
    enableRunCode
    enableSubmit
    enableTestMode
    exampleTestcaseList
    metaData
  }
}`;
export {
  globaldata,
  problemsetQuestionList,
  getProblemContent,
  questionEditorData,
  getTestCaseDataQuery,
};
