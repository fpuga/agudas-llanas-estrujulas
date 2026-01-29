interface SyllableBlockProps {
  syllable: string;
  isTonic?: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function SyllableBlock({ 
  syllable, 
  isSelected, 
  isCorrect, 
  isWrong, 
  onClick,
  disabled 
}: SyllableBlockProps) {
  let bgColor = 'bg-white';
  let borderColor = 'border-sky-200';
  let textColor = 'text-sky-800';

  if (isCorrect) {
    bgColor = 'bg-emerald-500';
    borderColor = 'border-emerald-600';
    textColor = 'text-white';
  } else if (isWrong) {
    bgColor = 'bg-rose-500';
    borderColor = 'border-rose-600';
    textColor = 'text-white';
  } else if (isSelected) {
    bgColor = 'bg-sky-500';
    borderColor = 'border-sky-600';
    textColor = 'text-white';
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        ${bgColor} ${borderColor} ${textColor}
        border-b-8 active:border-b-0 active:translate-y-2
        w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center
        text-2xl md:text-4xl font-black uppercase shadow-lg
        transition-all duration-100
        disabled:cursor-default disabled:active:translate-y-0 disabled:active:border-b-8
      `}
    >
      {syllable}
    </button>
  );
}
