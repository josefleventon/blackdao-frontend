import React, { SVGProps } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import {
  XMarkIcon as XIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import toast, { Toaster, ToastOptions } from 'react-hot-toast'
import { classNames } from 'util/css'

export const ToasterContainer = Toaster

export enum ToastTypes {
  Success = 'success',
  Error = 'error',
  Pending = 'pending',
  Warning = 'warning',
}

export interface ToastPayload {
  actions?: JSX.Element
  message?: string | JSX.Element
  title: string
  type: ToastTypes
  dismissable?: boolean
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ml-2 mr-3 h-5 w-5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

function customToast(
  { actions, title, type, message, dismissable }: ToastPayload,
  options?: ToastOptions,
): any {
  let Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element

  switch (type) {
    case ToastTypes.Success: {
      Icon = CheckCircleIcon
      break
    }
    case ToastTypes.Error: {
      Icon = ExclamationCircleIcon
      break
    }
    case ToastTypes.Pending: {
      Icon = Spinner
      break
    }
    case ToastTypes.Warning: {
      Icon = ExclamationTriangleIcon
      break
    }
  }

  return toast.custom(
    (t) => (
      <div
        onLoad={() => {
          setTimeout(() => toast.dismiss(t.id), 3000)
        }}
        onClick={dismissable ? () => toast.dismiss(t.id) : () => {}}
        className={classNames(
          t.visible ? 'animate-enter' : 'animate-leave',
          dismissable ? 'cursor-pointer' : '',
          'group w-full max-w-sm bg-opacity-90 [backdrop-filter:blur(10px)] border border-black/10 dark:border-white/10 shadow-lg rounded-lg pointer-events-auto p-4',
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              className="w-6 h-6 text-black dark:text-white"
              aria-hidden="true"
            />
          </div>

          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-black dark:text-white">
              {title}
            </p>

            {message && (
              <p className="mt-1 text-sm text-gray-400 dark:text-white/50">
                {message}
              </p>
            )}

            {actions}
          </div>
          {dismissable && (
            <div className="justify-center flex-shrink-0 hidden h-full ml-4 group-hover:flex">
              <button className="inline-flex text-black dark:text-white">
                <span className="sr-only">Close</span>
                <XIcon className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    ),
    options,
  )
}

interface CustomToast {
  dismiss: typeof toast.dismiss
  toast: typeof customToast
  error: (msg: string) => void
}

export default function useToaster(): CustomToast {
  function error(msg: string) {
    customToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: msg,
    })
  }

  return {
    dismiss: toast.dismiss,
    toast: customToast,
    error,
  }
}
