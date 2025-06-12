import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from '../components/ui/scroll-area';
import { Calendar, Clock, Hash, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { TooltipProvider } from '../components/ui/tooltip';
import { Tooltip as MuiTooltip } from '@mui/material';
import { cronToDescription, validateCron, getNextExecutions } from '../utils/cronUtils';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { getLocale } from '../locales';
import { cn, getThemeClass } from '../lib/utils';
import "../styles/styles.css"
// Import types from the types folder
import {
  CronBuilderProps,
  FrequencyPreset,
  FieldConfig,
  NumericInputProps,
  defaultFieldConfig,
  MONTHS,
  WEEKDAYS,
  FREQUENCY_PRESETS,
  getVisibleFields,
} from '../types';
import { defaultTheme } from '../themes/cronThemes';


// Componente NumericInput personalizado
const NumericInput: React.FC<NumericInputProps> = ({
  value,
  min,
  max,
  onChange,
  className = '',
  style
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab') {
      // Permitir navegación y borrado
      return;
    } else if (!/[0-9]/.test(e.key)) {
      // Bloquear cualquier carácter que no sea número
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let newValue = parseInt(target.value);

    if (isNaN(newValue)) {
      target.value = value.toString();
      return;
    }

    if (newValue < min) {
      newValue = min;
    } else if (newValue > max) {
      newValue = max;
    }

    target.value = newValue.toString();
    onChange(newValue);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onInput={handleInput}
        className={`pr-6 ${className}`}
        style={style}
        readOnly={false}
      />
      <div className="absolute right-1 top-0 h-full flex flex-col">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-5 w-4 p-0 hover:bg-transparent"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-5 w-4 p-0 hover:bg-transparent"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export const CronBuilder: React.FC<CronBuilderProps> = ({
  value = '* * * * *',
  onChange,
  showDescription = false,
  showPreview = false,
  showResult = true,
  showFields = {
    minutes: true,
    hours: true,
    dayOfMonth: true,
    month: true,
    dayOfWeek: true,
  },
  labels,
  className = '',
  compact = false,
  theme = defaultTheme,
  showPresets = true,
  defaultPreset = 'daily',
  locale = 'es',
  showClearButton = true,
}) => {
  const [fields, setFields] = useState<{
    minutes: FieldConfig;
    hours: FieldConfig;
    dayOfMonth: FieldConfig;
    month: FieldConfig;
    dayOfWeek: FieldConfig;
  }>({
    minutes: { ...defaultFieldConfig },
    hours: { ...defaultFieldConfig },
    dayOfMonth: { ...defaultFieldConfig },
    month: { ...defaultFieldConfig },
    dayOfWeek: { ...defaultFieldConfig },
  });

  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<FrequencyPreset>(defaultPreset);

  // Get themed styles
  const themedStyles = useThemedStyles(theme);

  // Get locale translations
  const t = getLocale(locale as 'es' | 'en' | 'ca');

  // Merge custom labels with locale defaults
  const fieldLabels = {
    minutes: labels?.minutes || t.minutes,
    hours: labels?.hours || t.hours,
    dayOfMonth: labels?.dayOfMonth || t.dayOfMonth,
    month: labels?.month || t.month,
    dayOfWeek: labels?.dayOfWeek || t.dayOfWeek,
  };

  const parseFieldValue = (value: string): FieldConfig => {
    if (value === '*') {
      return { ...defaultFieldConfig, type: 'every', value: '*' };
    }

    if (value.includes('/')) {
      const [, interval] = value.split('/');
      return {
        ...defaultFieldConfig,
        type: 'interval',
        value,
        intervalValue: parseInt(interval),
      };
    }

    if (value.includes('-')) {
      const [start, end] = value.split('-');
      return {
        ...defaultFieldConfig,
        type: 'range',
        value,
        rangeStart: parseInt(start),
        rangeEnd: parseInt(end),
      };
    }

    if (value.includes(',')) {
      const values = value.split(',').map(v => parseInt(v));
      return {
        ...defaultFieldConfig,
        type: 'specific',
        value,
        specificValues: values,
      };
    }

    return {
      ...defaultFieldConfig,
      type: 'specific',
      value,
      specificValues: [parseInt(value)],
    };
  };

  const parseCronExpression = useCallback((cronExpr: string) => {
    const parts = cronExpr.split(' ');
    if (parts.length !== 5) return;

    const newFields = {
      minutes: { ...defaultFieldConfig },
      hours: { ...defaultFieldConfig },
      dayOfMonth: { ...defaultFieldConfig },
      month: { ...defaultFieldConfig },
      dayOfWeek: { ...defaultFieldConfig },
    };
    const fieldNames = ['minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek'] as const;

    parts.forEach((part, index) => {
      const fieldName = fieldNames[index];
      newFields[fieldName] = parseFieldValue(part);
    });

    setFields(newFields);

    // Detectar preset basado en la expresión
    const preset = FREQUENCY_PRESETS.find(p => p.cron === cronExpr);
    if (preset) {
      setCurrentPreset(preset.value as FrequencyPreset);
    } else {
      // Si no coincide con ningún preset, usar el más específico (yearly)
      setCurrentPreset('yearly');
    }
  }, []);

  // Parse initial CRON expression
  useEffect(() => {
    if (value && value !== '* * * * *' && !isInitialized) {
      parseCronExpression(value);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Aplicar preset por defecto
      const presetConfig = FREQUENCY_PRESETS.find(p => p.value === defaultPreset);
      if (presetConfig?.cron) {
        parseCronExpression(presetConfig.cron);
      }
      setIsInitialized(true);
    }
  }, [value, isInitialized, parseCronExpression, defaultPreset]);

  const generateCronExpression = useMemo(() => {
    const generateFieldValue = (fieldName: keyof typeof fields): string => {
      const field = fields[fieldName];

      switch (field.type) {
        case 'every':
          return '*';
        case 'interval':
          return `*/${field.intervalValue}`;
        case 'range':
          return `${field.rangeStart}-${field.rangeEnd}`;
        case 'specific':
          return field.specificValues.join(',');
        default:
          return '*';
      }
    };

    const parts = [
      generateFieldValue('minutes'),
      generateFieldValue('hours'),
      generateFieldValue('dayOfMonth'),
      generateFieldValue('month'),
      generateFieldValue('dayOfWeek'),
    ];
    return parts.join(' ');
  }, [fields]);

  useEffect(() => {
    const expression = generateCronExpression;
    const validation = validateCron(expression, locale as 'es' | 'en' | 'ca');

    if (!validation.isValid) {
      setError(validation.error || t.invalidCron);
    } else {
      setError('');
      onChange?.(expression);

      // Verificar si la expresión actual coincide exactamente con algún preset
      const matchingPreset = FREQUENCY_PRESETS.find(p => p.cron === expression);
      if (matchingPreset && matchingPreset.value !== currentPreset) {
        setCurrentPreset(matchingPreset.value as FrequencyPreset);
      }
      // Si no coincide exactamente, mantener el preset actual (el usuario está personalizando)
    }
  }, [fields, onChange, generateCronExpression, currentPreset, t.invalidCron, locale]);

  const updateField = (fieldName: keyof typeof fields, updates: Partial<FieldConfig>) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], ...updates },
    }));
    // La expresión resultante se verificará en el useEffect
    // y automáticamente detectará si coincide con algún preset
  };

  const handlePresetChange = (preset: FrequencyPreset) => {
    setCurrentPreset(preset);
    const presetConfig = FREQUENCY_PRESETS.find(p => p.value === preset);
    if (presetConfig?.cron) {
      parseCronExpression(presetConfig.cron);
    }
  };

  // Reset function to restore component to default state
  const handleReset = () => {
    // Reset to default preset
    setCurrentPreset(defaultPreset);

    // Reset all fields to default configuration
    setFields({
      minutes: { ...defaultFieldConfig },
      hours: { ...defaultFieldConfig },
      dayOfMonth: { ...defaultFieldConfig },
      month: { ...defaultFieldConfig },
      dayOfWeek: { ...defaultFieldConfig },
    });

    // Apply default preset's cron expression
    const defaultPresetConfig = FREQUENCY_PRESETS.find(p => p.value === defaultPreset);
    if (defaultPresetConfig?.cron) {
      parseCronExpression(defaultPresetConfig.cron);
    }

    // Clear any errors
    setError('');
  };

  // Determinar qué campos mostrar basado en el preset actual
  const visibleFields = useMemo(() => {
    const fieldsFromPreset = getVisibleFields(currentPreset);
    return fieldsFromPreset.reduce((acc, fieldName) => {
      acc[fieldName as keyof typeof showFields] = showFields[fieldName as keyof typeof showFields] !== false;
      return acc;
    }, {} as typeof showFields);
  }, [currentPreset, showFields]);

  const getFieldOptions = (fieldName: keyof typeof fields) => {
    switch (fieldName) {
      case 'minutes':
        return { min: 0, max: 59, options: [] };
      case 'hours':
        return { min: 0, max: 23, options: [] };
      case 'dayOfMonth':
        return { min: 1, max: 31, options: [] };
      case 'month':
        const monthOptions = MONTHS.map(month => ({
          value: month.value,
          label: t.months[month.label as keyof typeof t.months],
          fullName: t.monthsFull[month.fullName as keyof typeof t.monthsFull]
        }));
        console.log('Month options debug:', { monthOptions, tMonths: t.months });
        return {
          min: 1,
          max: 12,
          options: monthOptions
        };
      case 'dayOfWeek':
        const weekdayOptions = WEEKDAYS.map(weekday => ({
          value: weekday.value,
          label: t.weekdays[weekday.label as keyof typeof t.weekdays],
          fullName: t.weekdaysFull[weekday.fullName as keyof typeof t.weekdaysFull]
        }));
        console.log('Weekday options debug:', { weekdayOptions, tWeekdays: t.weekdays });
        return {
          min: 0,
          max: 6,
          options: weekdayOptions
        };
      default:
        return { min: 0, max: 59, options: [] };
    }
  };

  // Función para formatear la visualización del valor del campo
  const getFieldDisplayValue = (fieldName: keyof typeof fields): string => {
    const field = fields[fieldName];
    const { options } = getFieldOptions(fieldName);

    switch (field.type) {
      case 'every':
        return '*';
      case 'interval':
        return `*/${field.intervalValue}`;
      case 'range':
        // Para campos con opciones, mostrar las etiquetas del rango
        if (options.length > 0) {
          const startOption = options.find(opt => opt.value === field.rangeStart);
          const endOption = options.find(opt => opt.value === field.rangeEnd);
          const startLabel = startOption?.label || field.rangeStart?.toString();
          const endLabel = endOption?.label || field.rangeEnd?.toString();
          return `${startLabel}-${endLabel}`;
        }
        return `${field.rangeStart}-${field.rangeEnd}`;
      case 'specific':
        if (field.specificValues.length === 0) {
          return '';
        }

        // Debug: log para ver qué está pasando
        console.log('getFieldDisplayValue debug:', {
          fieldName,
          specificValues: field.specificValues,
          options,
          hasOptions: options.length > 0
        });

        // Para campos con opciones (mes y día de semana), mostrar las etiquetas
        if (options.length > 0) {
          const labels = field.specificValues.map(value => {
            const option = options.find(opt => opt.value === value);
            console.log('Finding option for value:', value, 'found:', option);
            return option?.label || value.toString();
          });
          console.log('Final labels:', labels);
          return labels.join(',');
        }

        // Para campos numéricos, siempre mostrar los valores individuales
        return field.specificValues.join(',');
      default:
        return '*';
    }
  };

  const renderFieldSelector = (fieldName: keyof typeof fields) => {
    if (!visibleFields[fieldName]) return null;

    const field = fields[fieldName];
    const { min, max, options } = getFieldOptions(fieldName);
    const Icon = fieldName === 'minutes' || fieldName === 'hours' ? Clock :
      fieldName === 'dayOfMonth' ? Calendar : Hash;

    return (
      <div key={String(fieldName)} className="flex items-center gap-2 min-w-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              className="justify-between min-w-[120px] max-w-[180px] rounded-lg"
              style={themedStyles.button}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-xs">
                  {fieldLabels[fieldName]}: {getFieldDisplayValue(fieldName)}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-4 rounded-lg"
            align="start"
            style={themedStyles.popover}
          >
            <div className="space-y-4">
              <h4 className="font-medium">{fieldLabels[fieldName]}</h4>

              <Select
                value={field.type}
                onValueChange={(type: FieldConfig['type']) =>
                  updateField(fieldName, { type, value: type === 'every' ? '*' : '' })
                }
              >
                <SelectTrigger
                  className="rounded-lg"
                  style={themedStyles.select}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="rounded-lg"
                  style={themedStyles.popover}
                >
                  <SelectItem
                    value="every"
                    className={cn("select-item", getThemeClass(theme))}
                  >
                    {t.every}
                  </SelectItem>
                  <SelectItem
                    value="specific"
                    className={cn("select-item", getThemeClass(theme))}
                  >
                    {t.specific}
                  </SelectItem>
                  <SelectItem
                    value="range"
                    className={cn("select-item", getThemeClass(theme))}
                  >
                    {t.range}
                  </SelectItem>
                  <SelectItem
                    value="interval"
                    className={cn("select-item", getThemeClass(theme))}
                  >
                    {t.interval}
                  </SelectItem>
                </SelectContent>
              </Select>

              {field.type === 'specific' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={themedStyles.classes.textSecondary}>
                      {t.selectValues}
                    </p>
                    <div className="text-xs" style={themedStyles.classes.textMuted}>
                      {field.specificValues.length} {field.specificValues.length === 1 ? t.selected : t.selectedPlural}
                    </div>
                  </div>

                  <div
                    className="border rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <ScrollArea
                      className="h-48 w-full rounded-lg"
                      style={themedStyles.scrollArea}
                    >
                      <div className="p-2">
                        <div className={`grid gap-1 ${(fieldName === 'month' || fieldName === 'dayOfWeek')
                          ? 'grid-cols-3'
                          : 'grid-cols-6'
                          }`}>
                          {Array.from({ length: max - min + 1 }, (_, i) => {
                            const value = min + i;
                            const option = options.find(opt => opt.value === value);
                            const isSelected = field.specificValues.includes(value);

                            const handleToggle = () => {
                              const newValues = isSelected
                                ? field.specificValues.filter(v => v !== value)
                                : [...field.specificValues, value].sort((a, b) => a - b);
                              updateField(fieldName, {
                                specificValues: newValues,
                                value: newValues.join(','),
                              });
                            };

                            return (
                              <div
                                key={value}
                                className="flex items-center gap-2 rounded py-1.5 px-1.5 cursor-pointer transition-colors"
                                onClick={handleToggle}
                                style={{
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <Checkbox
                                  id={`${String(fieldName)}-${value}`}
                                  checked={isSelected}
                                  onCheckedChange={() => { }} // Manejado por el div padre
                                  className="h-3.5 w-3.5 rounded-sm border transition-all duration-150 flex-shrink-0 pointer-events-none"
                                  style={{
                                    backgroundColor: isSelected ? theme.checkbox.checked : theme.checkbox.background,
                                    borderColor: isSelected ? theme.checkbox.checked : theme.checkbox.border,
                                    color: isSelected ? theme.checkbox.checkmark : 'transparent',
                                  }}
                                />
                                <span
                                  className={`text-xs select-none ${isSelected
                                    ? 'font-medium'
                                    : 'font-normal'
                                    }`}
                                  style={{
                                    color: isSelected ? theme.text.primary : theme.text.muted
                                  }}
                                >
                                  {option?.label || value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>

                  {field.specificValues.length > 0 && (
                    <div
                      className="flex items-center justify-between pt-2 border-t"
                      style={{ borderTopColor: theme.border }}
                    >
                      <div className="text-xs" style={themedStyles.classes.textMuted}>
                        {t.values} {field.specificValues.sort((a, b) => a - b).map(value => {
                          const option = options.find(opt => opt.value === value);
                          return option?.label || value.toString();
                        }).join(', ')}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateField(fieldName, {
                            specificValues: [],
                            value: '',
                          });
                        }}
                        className="text-xs h-6 px-2 hover:bg-opacity-10"
                        style={{
                          color: theme.text.secondary,
                        }}
                      >
                        {t.clear}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {field.type === 'range' && (
                <div className="space-y-2">
                  <p className="text-sm" style={themedStyles.classes.textMuted}>{t.rangeLabel}</p>
                  <div className="flex items-center gap-2">
                    <NumericInput
                      value={field.rangeStart || min}
                      min={min}
                      max={max}
                      onChange={(start) => {
                        updateField(fieldName, {
                          rangeStart: start,
                          value: `${start}-${field.rangeEnd || start}`,
                        });
                      }}
                      className="w-20"
                      style={themedStyles.input}
                    />
                    <span style={themedStyles.classes.textSecondary}>-</span>
                    <NumericInput
                      value={field.rangeEnd || max}
                      min={field.rangeStart || min}
                      max={max}
                      onChange={(end) => {
                        updateField(fieldName, {
                          rangeEnd: end,
                          value: `${field.rangeStart || min}-${end}`,
                        });
                      }}
                      className="w-20"
                      style={themedStyles.input}
                    />
                  </div>
                </div>
              )}

              {field.type === 'interval' && (
                <div className="space-y-2">
                  <p className="text-sm" style={themedStyles.classes.textMuted}>{t.everyLabel}</p>
                  <div className="flex items-center gap-2">
                    <NumericInput
                      value={field.intervalValue || 1}
                      min={1}
                      max={max}
                      onChange={(interval) => {
                        updateField(fieldName, {
                          intervalValue: interval,
                          value: `*/${interval}`,
                        });
                      }}
                      className="w-20"
                      style={themedStyles.input}
                    />
                    <span className="text-sm" style={themedStyles.classes.textSecondary}>
                      {fieldLabels[fieldName]?.toLowerCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const renderPresetSelector = () => {
    if (!showPresets) return null;

    const currentPresetConfig = FREQUENCY_PRESETS.find(p => p.value === currentPreset);

    return (
      <div className="flex items-center gap-2 min-w-0">
        <Select
          value={currentPreset}
          onValueChange={handlePresetChange}
        >
          <SelectTrigger
            className={`min-w-[120px] max-w-[180px] justify-between rounded-lg ${compact ? 'h-8 px-2 text-xs' : ''}`}
            style={themedStyles.select}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Hash className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-xs">
                {t[currentPresetConfig?.label as keyof typeof t] as string}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </SelectTrigger>
          <SelectContent
            className="rounded-lg"
            style={themedStyles.popover}
          >
            {FREQUENCY_PRESETS.map((preset) => (
              <SelectItem
                key={preset.value}
                value={preset.value}
                className={cn(
                  "cron-preset-item transition-all duration-200",
                  getThemeClass(theme)
                )}
              >
                {t[preset.label as keyof typeof t] as string}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Detectar si el tema es oscuro basándose en el surface
  const isDarkTheme = useMemo(() => {
    // Verificar si es uno de los temas oscuros conocidos
    if (theme.primary === '#3B82F6' || // darkTheme
      theme.primary === '#FDB813' || // cerberusTheme
      theme.surface.includes('#1E293B') ||
      theme.surface.includes('#2D2D2D') ||
      theme.surface.includes('222.2 84% 4.9%') // dark mode from CSS variables
    ) {
      return true;
    }
    return false;
  }, [theme]);

  return (
    <TooltipProvider>
      <div
        className={`cron-builder-component ${isDarkTheme ? 'dark' : ''} space-y-3 ${className}`}
        style={themedStyles.container}
      >
        {/* Field Selectors */}
        <div className={`flex flex-wrap items-center gap-2 ${compact ? 'gap-1' : 'gap-2'}`}>
          {renderPresetSelector()}
          {getVisibleFields(currentPreset).map((fieldName) =>
            renderFieldSelector(fieldName as keyof typeof fields)
          )}

          {showClearButton && (
            <MuiTooltip title={t.reset} arrow>
              <Button
                type="button"
                variant="outline"
                size={compact ? "sm" : "default"}
                className="justify-center min-w-[50px] rounded-lg"
                style={themedStyles.button}
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </MuiTooltip>
          )}
        </div>

        {/* Expression Output */}
        {showResult && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-sm inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                style={themedStyles.badge}
              >
                {generateCronExpression}
              </span>
              {error && (
                <span
                  className="text-xs inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    borderColor: '#B91C1C',
                  }}
                >
                  {error}
                </span>
              )}
            </div>

            {showDescription && !error && (
              <p className="text-sm" style={themedStyles.classes.textSecondary}>
                {cronToDescription(generateCronExpression, locale as 'es' | 'en' | 'ca')}
              </p>
            )}

            {showPreview && !error && (
              <div className="text-xs" style={themedStyles.classes.textMuted}>
                <p className="font-medium mb-1" style={themedStyles.classes.textSecondary}>{t.nextExecutions}</p>
                <div className="space-y-1">
                  {getNextExecutions(generateCronExpression, 3, locale as 'es' | 'en' | 'ca').map((date, index) => (
                    <div key={index}>• {date}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default CronBuilder;
