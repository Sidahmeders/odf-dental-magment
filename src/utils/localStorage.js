import { omit } from 'lodash'
import { CREATE_PROFILE_NAMES } from '../config'

const PATIENT = 'patient'
const TEMPLATE_BUTTONS = 'templateButtons'
const VISIT_BUTTONS = 'visitButtons'
const PAGE_ROUTE = 'pageRoute'

export const getPatient = () => {
  const patient = localStorage.getItem(PATIENT)
  return JSON.parse(patient) || {}
}

export const setPatient = (patient) => {
  const omitedPatient = omit(patient, [CREATE_PROFILE_NAMES.PROFILE_IMAGE])
  localStorage.setItem(PATIENT, JSON.stringify(omitedPatient))
}

export const getEventTemplateButtons = () => {
  const templateButtons = localStorage.getItem(TEMPLATE_BUTTONS)
  return JSON.parse(templateButtons) || []
}

export const addEventTemplateButtons = (template) => {
  const allTemplateButtons = getEventTemplateButtons()
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify([...allTemplateButtons, template]))
}

export const dropEventTemplateButton = (templateId) => {
  const filteredTemplateButtons = getEventTemplateButtons().filter(({ id }) => templateId !== id)
  localStorage.setItem(TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}

export const getVistTemplateButtons = () => {
  const visitTemplateButtons = localStorage.getItem(VISIT_BUTTONS)
  return JSON.parse(visitTemplateButtons) || []
}

export const addVisitTemplateButtons = (template) => {
  const allTemplateButtons = getVistTemplateButtons()
  localStorage.setItem(VISIT_BUTTONS, JSON.stringify([...allTemplateButtons, template]))
}

export const dropVisitTemplateButton = (templateId) => {
  const filteredTemplateButtons = getVistTemplateButtons().filter(({ id }) => templateId !== id)
  localStorage.setItem(VISIT_BUTTONS, JSON.stringify(filteredTemplateButtons))
}

export const getPageRoute = () => {
  const pageRoute = localStorage.getItem(PAGE_ROUTE)
  return JSON.parse(pageRoute) || {}
}

export const setPageRoute = (route) => {
  localStorage.setItem(PAGE_ROUTE, JSON.stringify(route))
}
