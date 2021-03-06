import { combineReducers } from 'redux'
import * as types from './action-types'
import { getId } from '../../shared/utils'

const initialAuthForm = {
  username: '', password: ''
}
function authForm(state = initialAuthForm, action) {
  switch (action.type) {
    case types.RESET:
    case types.AUTH_FORM_RESET:
      return initialAuthForm
    case types.AUTH_FORM_INPUT_CHANGE:
      return { ...state, [action.payload.id]: action.payload.value }
    default:
      return state
  }
}

const initialQuestionForm = () => ({
  question_title: '', question_text: '',
  options: {
    [getId()]: { option_text: '', is_correct: true, remark: '' },
    [getId()]: { option_text: '', is_correct: false, remark: '' },
  }
})
function questionForm(state = initialQuestionForm(), action) {
  switch (action.type) {
    case types.RESET:
    case types.QUESTION_FORM_RESET:
      return initialQuestionForm()
    case types.QUESTION_FORM_INPUT_CHANGE: {
      return { ...state, [action.payload.name]: action.payload.value }
    }
    case types.QUESTION_FORM_OPTION_INPUT_CHANGE: {
      const { optionKey, name, value } = action.payload
      const optionToChange = state.options[optionKey]
      const changed = { ...optionToChange, [name]: value }
      return { ...state, options: { ...state.options, [optionKey]: changed } }
    }
    case types.QUESTION_FORM_SET_CORRECT_OPTION: {
      const options = { ...state.options }
      for (let key in options) {
        options[key].is_correct = key === action.payload
      }
      return { ...state, options }
    }
    case types.QUESTION_FORM_OPTION_ADDITION: {
      const { options } = state
      const optionKey = action.payload
      if (Object.keys(options).length >= 10) return state
      return {
        ...state,
        options: {
          ...options,
          [optionKey]: { option_text: '', is_correct: false, remark: '' }
        }
      }
    }
    case types.QUESTION_FORM_OPTION_REMOVAL: {
      const options = { ...state.options }
      if (Object.keys(options).length <= 2) return state
      const isNonDistractor = options[action.payload].is_correct
      delete options[action.payload]
      if (isNonDistractor) {
        Object.values(options)[0].is_correct = true
      }
      return { ...state, options }
    }
    default:
      return state
  }
}

function infoMessage(state = 'Test your knowledge...', action) {
  switch (action.type) {
    case types.RESET:
      return ''
    case types.SET_INFO_MESSAGE:
      return action.payload
    default:
      return state
  }
}

const initialAuth = { user: false, admin: false, username: null }
function auth(state = initialAuth, action) {
  switch (action.type) {
    case types.RESET:
      return initialAuth
    case types.SET_AUTH_STATUS:
      return action.payload
    default:
      return state
  }
}

const initialQuiz = { question: null, option_id: null }
function quiz(state = initialQuiz, action) {
  switch (action.type) {
    case types.SET_QUIZ:
      return { option_id: null, question: action.payload }
    case types.QUIZ_SET_SELECTED_OPTION:
      return { ...state, option_id: action.payload }
    default:
      return state
  }
}

const initialStats = {}
function stats(state = initialStats, action) {
  switch (action.type) {
    case types.RESET:
      return initialStats
    case types.SET_GENERAL_STATS:
      return { ...state, general: action.payload }
    default:
      return state
  }
}

export default combineReducers({
  authForm,
  questionForm,
  quiz,
  infoMessage,
  auth,
  stats,
})
