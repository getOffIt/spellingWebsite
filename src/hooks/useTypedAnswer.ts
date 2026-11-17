import { useEffect, useState, type RefObject, type SyntheticEvent } from 'react';

// Scoped to answer fields: copying elsewhere and ordinary typing remain available.
export function useTypedAnswer(ref: RefObject<HTMLInputElement | HTMLTextAreaElement | null>) {
  const [reminder, setReminder] = useState('');
  const blockTransfer = (event: SyntheticEvent) => {
    event.preventDefault();
    setReminder('Type it yourself, ninja 🥷');
  };

  // Native beforeinput covers clipboard insertion paths used by mobile keyboards.
  // Rebind after each render because the test field can disappear for results/practice.
  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    const beforeInput = (event: InputEvent) => {
      if (['insertFromPaste', 'insertFromPasteAsQuotation', 'insertFromDrop'].includes(event.inputType)) {
        event.preventDefault();
        setReminder('Type it yourself, ninja 🥷');
      }
    };
    field.addEventListener('beforeinput', beforeInput);
    return () => field.removeEventListener('beforeinput', beforeInput);
  });

  return { reminder, clearReminder: () => setReminder(''), onPaste: blockTransfer, onDrop: blockTransfer };
}
