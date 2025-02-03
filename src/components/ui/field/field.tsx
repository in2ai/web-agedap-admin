import * as React from 'react';

type FieldsetProps = {
  id?: string;
  label?: string;
  selected?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea';
  flex?: 'row | column';
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
  textUnit?: string;
  className?: string;
  tabIndex?: number;
  value?: string;
  isReadOnly?: boolean;
  isAutoFill?: boolean;
  onChange?: (value: string) => void;
};

export const Field: React.FC<FieldsetProps> = ({
  id,
  label,
  selected,
  type = 'text',
  flex = 'column',
  size = 'medium',
  placeholder,
  textUnit,
  className,
  tabIndex = -1,
  value,
  isReadOnly = false,
  isAutoFill = false,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = React.useState<string>();
  const [readOnly, setReadOnly] = React.useState(true);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onChangeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  const onChangeTextareaHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  return (
    <div
      className={[
        'w-full',
        className,
        flex === 'row' ? 'flex' : '',
        flex === 'column' ? 'flex flex-col' : '',
        size === 'small' ? '' : '',
        size === 'medium' ? '' : '',
        size === 'large' ? '' : '',
        selected ? '' : '',
      ].join(' ')}
    >
      {label && (
        <label className={'mb-2 w-full truncate font-medium capitalize-first'} htmlFor={id}>
          {label}
          {textUnit ? ` (${textUnit})` : ''}
        </label>
      )}
      {type !== 'textarea' && (
        <div className="flex w-full">
          <input
            placeholder={placeholder ?? ''}
            autoComplete="off"
            ref={inputRef}
            className={`w-full  px-3 py-2 ${isReadOnly ? 'focus:outline-none' : 'focus:outline-[#a0a0a0]'} rounded-l border-solid border-[#ababab] ${isReadOnly ? 'cursor-default border-none bg-[#e9e9e9] text-[#76777a] focus:border-none focus:outline-none' : 'bg-[#f1f1f1]'}`}
            type={type}
            id={id}
            tabIndex={isReadOnly ? -1 : tabIndex}
            value={inputValue ?? ''}
            onChange={onChangeInputHandler}
            onClick={() => (isReadOnly ? inputRef.current?.blur() : inputRef.current?.focus())}
            readOnly={isAutoFill ? isReadOnly : isReadOnly ? true : readOnly}
            onFocus={() => !isAutoFill && setReadOnly(false)}
            onBlur={() => !isAutoFill && setReadOnly(true)}
          />
          {textUnit && (
            <div className="flex h-full items-center rounded-r bg-[#d8d8d8] px-3 py-2">
              {textUnit}
            </div>
          )}
        </div>
      )}
      {type === 'textarea' && (
        <textarea
          placeholder={placeholder ?? ''}
          autoComplete="off"
          readOnly={isReadOnly ? true : false}
          ref={textareaRef}
          className={`w-full ${isReadOnly ? 'focus:outline-none' : 'focus:outline-[#a0a0a0]'} rounded border-solid border-[#ababab] px-3 py-2 ${isReadOnly ? 'cursor-default border-none bg-[#e9e9e9] pl-0 pt-0 text-[#76777a] focus:border-none focus:outline-none' : 'bg-[#f1f1f1]'}`}
          id={id}
          tabIndex={isReadOnly ? -1 : tabIndex}
          value={inputValue ?? ''}
          onChange={onChangeTextareaHandler}
          onClick={() => (isReadOnly ? inputRef.current?.blur() : inputRef.current?.focus())}
        />
      )}
    </div>
  );
};

export default Field;
