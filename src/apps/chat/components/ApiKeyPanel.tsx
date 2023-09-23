import * as React from 'react';

type Props = {
  onApiKeySubmit: (key: string) => void
};

const ApiKeyPanel = (props: Props) => {
  const apiKeyInput = React.useRef<HTMLInputElement>(null);
  const submitOpenAiApiKey = () => {
    if (!apiKeyInput.current) {
      return;
    }
    
    const apiKey = apiKeyInput.current.value;

    props.onApiKeySubmit(apiKey);
  };

  return (
    <div className='api-key-panel'>
      <div className='input-container'>
        <input ref={apiKeyInput} className='user-input' type='text' placeholder='Enter your Open AI API key...' />
        <button className='submit-button' onClick={submitOpenAiApiKey}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

export default ApiKeyPanel;