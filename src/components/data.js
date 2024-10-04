export const questionSetEditorConfig = {
  context: {
    programId: '',
    contributionOrgId: '',
    user: {
      id: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
      fullName: 'Rahul Tekdi',
      firstName: 'Rahul ',
      lastName: 'Tekdi',
      orgIds: ['test-k12-channel']
    },
    identifier: 'do_214151758052073472145',
    authToken: ' ',
    sid: 'iYO2K6dOSdA0rwq7NeT1TDzS-dbqduvV',
    did: '7e85b4967aebd6704ba1f604f20056b6',
    uid: 'bf020396-0d7b-436f-ae9f-869c6780fc45',
    channel: 'test-k12-channel',
    pdata: {
      id: 'dev.dock.portal',
      ver: '2.8.0',
      pid: 'creation-portal'
    },
    contextRollup: {
      l1: '01307938306521497658',
    },
    tags: ['01307938306521497658'],
    cdata: [
      {
        id: '01307938306521497658',
        type: 'sourcing_organization',
      },
      {
        type: 'project',
        id: 'ec5cc850-3f71-11eb-aae1-fb99d9fb6737',
      },
      {
        type: 'linked_collection',
        id: 'do_113140468925825024117'
      }
    ],
    timeDiff: 5,
    objectRollup: {
      l1: 'do_113140468925825024117',
      l2: 'do_113140468926914560125'
    },
    host: '',
    defaultLicense: 'CC BY 4.0',
    endpoint: '/data/v3/telemetry',
    env: 'questionset_editor',
    framework: 'test_k12_framework',
    cloudStorageUrls: ['https://knowlg-public.s3-ap-south-1.amazonaws.com/'],
    labels: {
      save_collection_btn_label: 'Save as Draft',
    },
    correctionComments: false,
    sourcingResourceStatus: true,
    cloudStorage: {
      provider: 'aws',
      presigned_headers: {}
    }
  },
  config: {
    mode: 'edit', // edit / review / read / sourcingReview // orgReview
    enableQuestionCreation: true,
    enableAddFromLibrary: true,
    editableFields: {
      sourcingreview: ['instructions'],
      orgreview: ['name', 'instructions', 'learningOutcome'],
      review: ['name', 'description'],
    },
    maxDepth: 4,
    objectType: 'QuestionSet',
    primaryCategory: 'Practice Question Set',
    isRoot: true,
    iconClass: 'fa fa-book',
    hideSubmitForReviewBtn: false,
    children: {
      Question: [
        'Multiple Choice Question',
        'Subjective Question'
      ]
    },
    addFromLibrary: false,
    hierarchy: {
      level1: {
        name: 'Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {},
        addFromLibrary: true
      },
      level2: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Multiple Choice Question',
            'Subjective Question'
          ]
        },
        addFromLibrary: true
      },
      level3: {
        name: 'Sub Section',
        type: 'Unit',
        mimeType: 'application/vnd.sunbird.questionset',
        primaryCategory: 'Practice Question Set',
        iconClass: 'fa fa-folder-o',
        children: {
          Question: [
            'Subjective Question'
          ]
        }
      }
    },
    contentPolicyUrl: '/term-of-use.html',
    assetProxyUrl: '/assets/public/',
    commonFrameworkLicenseUrl: 'https://creativecommons.org/licenses/'
  }
};