import type { AxiosError } from 'axios'

export function getAxiosErrorMessage(error: AxiosError): string {
  return error.message
}

