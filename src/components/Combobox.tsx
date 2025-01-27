import { forwardRef, useRef, useState } from "react";
import {
  autoUpdate,
  size,
  flip,
  useId,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  FloatingFocusManager,
  FloatingPortal
} from "@floating-ui/react";

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

export default function AutoComplete({
  data,
  input: [inputValue, setInputValue],
  placeholder,
  type = "text",
}: {
  data: { label: string; value: string }[];
  input: [string, (value: string) => void];
  placeholder: string;
  type?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`
          });
        },
        padding: 10
      })
    ]
  });

  const role = useRole(context, { role: "listbox" });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true
  });

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps
  } = useInteractions([role, dismiss, listNav]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setOpen(true);
      setActiveIndex(0);
    }
  }

  const items = data.filter((item) =>
    item.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  return (
    <>
      <input
        className={`flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-2 focus:outline-blue-400 ${
          open && items.length != 0 && "rounded-b-none"
        }`}
        {...getReferenceProps({
          ref: refs.setReference,
          onChange,
          value: inputValue,
          type: type,
          placeholder: placeholder,
          "aria-autocomplete": "list",
          onKeyDown(event) {
            if (
              event.key === "Enter" &&
              activeIndex != null &&
              items[activeIndex]
            ) {
              setInputValue(items[activeIndex].value);
              setActiveIndex(null);
              setOpen(false);
            }
          },
          onFocus(_event) {
            setOpen(true);
          }
        })}
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: floatingStyles,
              })}
              className={`overflow-y-auto rounded-b-lg border border-gray-300 bg-white shadow-lg ${items.length == 0 && "border-0"}`}
            >
              {items.map((item, index) => (
                <Item
                  {...getItemProps({
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item.value);
                      setOpen(false);
                      refs.domReference.current?.focus();
                    }
                  })}
                  key={item.value}
                  active={activeIndex === index}
                >
                  {item.label}
                </Item>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}

const Item = forwardRef<
  HTMLDivElement,
  ItemProps & React.HTMLProps<HTMLDivElement>
>(({ children, active, ...rest }, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      {...rest}
      className={`w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-blue-100 ${
        active && "bg-blue-100"
      }`}
    >
      {children}
    </div>
  );
});