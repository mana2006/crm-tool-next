import { Button } from "../ui/button"

export const LoadingState = () => (
  <div className="flex h-full w-full items-center justify-center" aria-busy="true">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
  </div>
)

export const ErrorState = ({ error }: { error: unknown }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2" role="alert">
    <p className="text-lg font-semibold text-red-500">Đã xảy ra lỗi</p>
    <pre className="max-h-40 overflow-auto rounded bg-gray-100 p-2 text-sm text-gray-800">
      {String(error)}
    </pre>
    <Button>Thử lại</Button>
  </div>
)

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    <p className="text-lg font-semibold text-gray-500">{message}</p>
  </div>
)
