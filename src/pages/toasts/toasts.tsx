import { ToastsProvider, useToasts } from './toasts-provider';

function ToastsDemo() {
  const { success, error, info } = useToasts();

  return (
    <>
      <h1>Toasts</h1>
      <div className="page-actions">
        <button type="button" className="success-btn" onClick={() => success('This is a success message!')}>
          Success
        </button>
        <button type="button" className="danger-btn" onClick={() => error('This is an error message!')}>
          Error
        </button>
        <button type="button" className="info-btn" onClick={() => info('This is an info message!')}>
          Info
        </button>
      </div>
    </>
  )
}

export default function Toasts() {
  return (
    <ToastsProvider>
      <ToastsDemo />
    </ToastsProvider>
  );
}
