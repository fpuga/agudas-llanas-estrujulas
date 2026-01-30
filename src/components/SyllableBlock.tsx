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
  disabled,
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
      className={` ${bgColor} ${borderColor} ${textColor} flex h-20 w-20 items-center justify-center rounded-2xl border-b-8 text-2xl font-black uppercase shadow-lg transition-all duration-100 active:translate-y-2 active:border-b-0 disabled:cursor-default disabled:active:translate-y-0 disabled:active:border-b-8 md:h-28 md:w-28 md:text-4xl`}
    >
      {syllable}
    </button>
  );
}
