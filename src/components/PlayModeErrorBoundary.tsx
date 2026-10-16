import { Component, type ErrorInfo, type ReactNode } from 'react';

interface PlayModeErrorBoundaryProps {
  children: ReactNode;
  onBackToClassic: () => void;
}

interface PlayModeErrorBoundaryState {
  failed: boolean;
}

/**
 * Keeps a Play mode failure from blanking the whole page. The usual cause is
 * the lazy chunk failing to load (e.g. a tab left open across a deploy, so
 * its chunk URL no longer exists). Browsers cache a failed dynamic import for
 * the life of the page, so "Try again" reloads rather than re-rendering.
 *
 * Styled from components.css, not play.css — if the chunk failed, its CSS
 * never arrived either.
 */
export default class PlayModeErrorBoundary extends Component<PlayModeErrorBoundaryProps, PlayModeErrorBoundaryState> {
  state: PlayModeErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): PlayModeErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Play mode failed to load or render:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="play-error" role="alert" aria-labelledby="play-error-heading">
        <h2 id="play-error-heading">Play mode couldn't load</h2>
        <p>Something went wrong loading it. Reloading usually fixes this.</p>
        <div className="play-error__actions">
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
          <button type="button" onClick={this.props.onBackToClassic}>
            Back to classic view
          </button>
        </div>
      </section>
    );
  }
}
