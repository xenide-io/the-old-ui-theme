"use client";

/**
 * Full UI surface — also published as `@xenide-io/the-old-ui-theme/ui`.
 * Scoped to primitives the ShellStack apps use, plus the demo-only docs
 * helpers (ShowcaseWrapper, ComponentDocs, CollapsibleSection, CodeBlock).
 */

export {
  Button as Button,
  type ButtonProps as ButtonProps,
  type ButtonShape as ButtonShape,
  type ButtonSize as ButtonSize,
  type ButtonVariant as ButtonVariant,
} from "@/components/ui/Button";
export {
  ButtonChrome as ButtonChrome,
  type ButtonChromeProps as ButtonChromeProps,
} from "@/components/ui/ButtonChrome";
export {
  Alert as Alert,
  type AlertProps as AlertProps,
  type AlertStatus as AlertStatus,
} from "@/components/ui/Alert";
export {
  Badge as Badge,
  type BadgeProps as BadgeProps,
  type BadgeSize as BadgeSize,
  type BadgeVariant as BadgeVariant,
} from "@/components/ui/Badge";
export {
  Card as Card,
  type CardProps as CardProps,
  type CardVariant as CardVariant,
} from "@/components/ui/Card";
export {
  Kbd as Kbd,
  type KbdPlatform as KbdPlatform,
  type KbdProps as KbdProps,
  type KbdVariant as KbdVariant,
} from "@/components/ui/Kbd";
export {
  Loader,
  LoadingState,
  Skeleton,
  type LoaderProps,
  type LoaderSize,
  type LoaderVariant,
  type LoadingStateProps,
  type SkeletonProps,
  type SkeletonShape,
} from "@/components/ui/Loader";
export {
  AuthCard,
  AuthDivider,
  AuthLayout,
  type AuthCardProps,
  type AuthDividerProps,
  type AuthLayoutProps,
} from "@/components/ui/AuthLayout";
export {
  SettingsLayout,
  SettingsNav,
  type SettingsLayoutProps,
  type SettingsNavGroup,
  type SettingsNavItem,
  type SettingsNavProps,
} from "@/components/ui/SettingsLayout";
export {
  DropdownButton as DropdownButton,
  DropdownItem as DropdownItem,
  DropdownMenu as DropdownMenu,
  DropdownRadioGroup as DropdownRadioGroup,
  DropdownRadioItem as DropdownRadioItem,
  type DropdownAlign as DropdownAlign,
  type DropdownButtonProps as DropdownButtonProps,
  type DropdownItemProps as DropdownItemProps,
  type DropdownMenuProps as DropdownMenuProps,
  type DropdownRadioGroupProps as DropdownRadioGroupProps,
  type DropdownRadioItemProps as DropdownRadioItemProps,
  type DropdownSide as DropdownSide,
} from "@/components/ui/DropdownMenu";
export {
  Checkbox as Checkbox,
  FileUpload as FileUpload,
  Input as Input,
  Radio as Radio,
  Range as Range,
  Select as Select,
  Textarea as Textarea,
  Toggle as Toggle,
  type CheckboxProps as CheckboxProps,
  type FileUploadProps as FileUploadProps,
  type InputProps as InputProps,
  type InputSize as InputSize,
  type InputVariant as InputVariant,
  type RadioProps as RadioProps,
  type RangeProps as RangeProps,
  type SelectProps as SelectProps,
  type TextareaProps as TextareaProps,
  type ToggleProps as ToggleProps,
} from "@/components/ui/Input";
export {
  FormField as FormField,
  type FormFieldControlProps as FormFieldControlProps,
  type FormFieldProps as FormFieldProps,
} from "@/components/ui/FormField";
export {
  Modal as Modal,
  type ModalProps as ModalProps,
  type ModalSize as ModalSize,
} from "@/components/ui/Modal";
export {
  Panel as Panel,
  type PanelProps as PanelProps,
} from "@/components/ui/Panel";
export {
  SearchGroup as SearchGroup,
  SearchInput as SearchInput,
  type SearchGroupProps as SearchGroupProps,
  type SearchInputProps as SearchInputProps,
} from "@/components/ui/SearchInput";
export {
  Table as Table,
  type TableColumn as TableColumn,
  type TableProps as TableProps,
} from "@/components/ui/Table";
export {
  Stat as Stat,
  type StatProps as StatProps,
  type StatTone as StatTone,
} from "@/components/ui/Stat";
export { ThemeDomSync } from "@/components/ui/ThemeDomSync";
export {
  ThemeSwitcher,
  type ThemeSwitcherProps,
} from "@/components/ui/ThemeSwitcher";
export {
  IconBase as Icon,
  IconByName as IconByName,
  type CanonicalIconName as CanonicalIconName,
  type IconAliasName as IconAliasName,
  type IconProps as IconProps,
  type IconName as IconName,
} from "@/components/icons";
export { Accordion } from "@/components/ui/Accordion";
export { SegmentedControl } from "@/components/ui/SegmentedControl";
export { CommandPalette } from "@/components/ui/CommandPalette";
export { Calendar } from "@/components/ui/Calendar";
export {
  Tooltip,
  TooltipProvider,
  type TooltipAlign,
  type TooltipProps,
  type TooltipProviderProps,
  type TooltipSide,
} from "@/components/ui/Tooltip";
export { EmptyState } from "@/components/ui/EmptyState";
export {
  FilterChips,
  type FilterChip,
  type FilterChipsProps,
} from "@/components/ui/FilterChips";
export {
  FilterBar,
  FilterMenu,
  SortMenu,
  type FilterBarProps,
  type FilterMenuOption,
  type FilterMenuProps,
  type SortMenuProps,
} from "@/components/ui/FilterBar";
export {
  FilterControls,
  type FilterControlsProps,
} from "@/components/ui/FilterControls";
export { CodeBlock } from "@/components/ui/CodeBlock";
export {
  ComponentDocs,
  type ComponentDocsProps,
  type ComponentPropRow,
} from "@/components/ui/ComponentDocs";
export { ShowcaseWrapper } from "@/components/ui/ShowcaseWrapper";
export { CollapsibleSection } from "@/components/ui/CollapsibleSection";
export {
  Display,
  SectionTitle,
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  Small,
  Caption,
  Overline,
  Lead,
  Mono,
  Label,
} from "@/components/ui/Typography";
export {
  Avatar as Avatar,
  AvatarGroup as AvatarGroup,
  type AvatarProps as AvatarProps,
  type AvatarSize as AvatarSize,
  type AvatarStatus as AvatarStatus,
  type AvatarGroupProps as AvatarGroupProps,
} from "@/components/ui/Avatar";
export {
  Progress as Progress,
  type ProgressProps as ProgressProps,
} from "@/components/ui/Progress";
export {
  Link as Link,
  type LinkProps as LinkProps,
} from "@/components/ui/Link";
export {
  Spinner as Spinner,
  type SpinnerProps as SpinnerProps,
} from "@/components/ui/Spinner";
export {
  Dot as Dot,
  type DotProps as DotProps,
} from "@/components/ui/Dot";
export {
  Chip as Chip,
  type ChipProps as ChipProps,
} from "@/components/ui/Chip";
