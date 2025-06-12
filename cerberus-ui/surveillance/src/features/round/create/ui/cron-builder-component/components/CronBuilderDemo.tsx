
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CronBuilder } from './CronBuilder';
import { CRON_PRESETS } from '../utils/cronUtils';
import { defaultTheme, darkTheme, cerberusTheme } from '../themes/cronThemes';
import { CronTheme } from '../types/cronTheme';
import { SupportedLocale } from '../locales';
import { cn, getThemeClass } from '../lib/utils';

export const CronBuilderDemo: React.FC = () => {
  const [cronExpression, setCronExpression] = useState('0 0 * * 0');
  const [showDescription, setShowDescription] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showPresets, setShowPresets] = useState(true);
  const [compact, setCompact] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'default' | 'dark' | 'cerberus'>('default');
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('es');
  const [enabledFields, setEnabledFields] = useState({
    minutes: true,
    hours: true,
    dayOfMonth: true,
    month: true,
    dayOfWeek: true,
  });

  const themes: Record<string, { theme: CronTheme; name: string; description: string }> = {
    default: {
      theme: defaultTheme,
      name: 'Default',
      description: 'Tema claro por defecto'
    },
    dark: {
      theme: darkTheme,
      name: 'Dark',
      description: 'Tema oscuro moderno'
    },
    cerberus: {
      theme: cerberusTheme,
      name: 'Cerberus',
      description: 'Tema dorado/negro elegante'
    }
  };

  const currentTheme = themes[selectedTheme].theme;

  const locales = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ca', label: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  ];

  const presets = [
    { label: 'Cada minuto', value: CRON_PRESETS.everyMinute },
    { label: 'Cada hora', value: CRON_PRESETS.everyHour },
    { label: 'Diario', value: CRON_PRESETS.everyDay },
    { label: 'Días laborables', value: CRON_PRESETS.weekdays },
    { label: 'Fines de semana', value: CRON_PRESETS.weekends },
    { label: 'Semanal', value: CRON_PRESETS.everyWeek },
    { label: 'Mensual', value: CRON_PRESETS.everyMonth },
  ];

  return (
    <div
      className="min-h-screen p-8 transition-all duration-300"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text.primary
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold"
            style={{ color: currentTheme.text.primary }}
          >
            Constructor de Expresiones CRON
          </h1>
          <p
            className="text-lg"
            style={{ color: currentTheme.text.secondary }}
          >
            Crea expresiones CRON de forma visual e intuitiva con temas personalizables
          </p>
        </div>

        {/* Theme and Locale Selector */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Configuración</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              Personaliza el tema y el idioma del constructor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label style={{ color: currentTheme.text.primary }}>Tema</Label>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(themes).map(([key, { name, description }]) => (
                  <Button
                    key={key}
                    variant={selectedTheme === key ? "default" : "outline"}
                    onClick={() => setSelectedTheme(key as 'default' | 'dark' | 'cerberus')}
                    className="flex flex-col items-start p-4 h-auto"
                    style={{
                      backgroundColor: selectedTheme === key ? currentTheme.primary : currentTheme.button.background,
                      borderColor: currentTheme.border,
                      color: selectedTheme === key ? currentTheme.checkbox.checkmark : currentTheme.text.primary
                    }}
                  >
                    <span className="font-medium">{name}</span>
                    <span className="text-xs opacity-80">{description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Locale Selection */}
            <div className="space-y-3">
              <Label style={{ color: currentTheme.text.primary }}>Idioma</Label>
              <Select value={selectedLocale} onValueChange={(value: SupportedLocale) => setSelectedLocale(value)}>
                <SelectTrigger className="w-[200px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {locales.map((locale) => (
                    <SelectItem
                      key={locale.value}
                      value={locale.value}
                      className={cn("select-item", getThemeClass(currentTheme))}
                    >
                      <div className="flex items-center gap-2">
                        <span>{locale.flag}</span>
                        <span>{locale.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Component */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Constructor CRON</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              Configura cada campo para crear tu expresión CRON personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CronBuilder
              value={cronExpression}
              onChange={setCronExpression}
              showDescription={showDescription}
              showPreview={showPreview}
              showPresets={showPresets}
              showFields={enabledFields}
              compact={compact}
              theme={currentTheme}
              defaultPreset="weekly"
              locale={selectedLocale}
            />
          </CardContent>
        </Card>

        {/* Configuration Options */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Opciones de Configuración</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              Personaliza el comportamiento y apariencia del componente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-description"
                  checked={showDescription}
                  onCheckedChange={setShowDescription}
                />
                <Label htmlFor="show-description" style={{ color: currentTheme.text.primary }}>
                  Mostrar descripción
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-preview"
                  checked={showPreview}
                  onCheckedChange={setShowPreview}
                />
                <Label htmlFor="show-preview" style={{ color: currentTheme.text.primary }}>
                  Mostrar próximas ejecuciones
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="compact"
                  checked={compact}
                  onCheckedChange={setCompact}
                />
                <Label htmlFor="compact" style={{ color: currentTheme.text.primary }}>
                  Modo compacto
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-presets"
                  checked={showPresets}
                  onCheckedChange={setShowPresets}
                />
                <Label htmlFor="show-presets" style={{ color: currentTheme.text.primary }}>
                  Mostrar presets de frecuencia
                </Label>
              </div>
            </div>

            <Separator style={{ borderColor: currentTheme.border }} />

            <div>
              <Label className="text-sm font-medium" style={{ color: currentTheme.text.primary }}>
                Campos habilitados:
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {Object.entries(enabledFields).map(([field, enabled]) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Switch
                      id={`field-${field}`}
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setEnabledFields(prev => ({ ...prev, [field]: checked }))
                      }
                    />
                    <Label
                      htmlFor={`field-${field}`}
                      className="text-sm capitalize"
                      style={{ color: currentTheme.text.primary }}
                    >
                      {field === 'dayOfMonth' ? 'Día mes' :
                        field === 'dayOfWeek' ? 'Día semana' : field}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presets */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Expresiones Predefinidas</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              Selecciona una configuración común para empezar rápidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setCronExpression(preset.value)}
                  className="justify-start"
                  style={{
                    backgroundColor: currentTheme.button.background,
                    borderColor: currentTheme.border,
                    color: currentTheme.text.primary
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Expression */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Expresión Actual</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              La expresión CRON generada y su interpretación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="font-mono text-lg p-3 rounded-lg border"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.border,
                color: currentTheme.text.primary
              }}
            >
              {cronExpression}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: currentTheme.badge.background,
                  color: currentTheme.badge.text,
                  borderColor: currentTheme.border
                }}
              >
                Minutos: {cronExpression.split(' ')[0]}
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: currentTheme.badge.background,
                  color: currentTheme.badge.text,
                  borderColor: currentTheme.border
                }}
              >
                Horas: {cronExpression.split(' ')[1]}
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: currentTheme.badge.background,
                  color: currentTheme.badge.text,
                  borderColor: currentTheme.border
                }}
              >
                Día mes: {cronExpression.split(' ')[2]}
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: currentTheme.badge.background,
                  color: currentTheme.badge.text,
                  borderColor: currentTheme.border
                }}
              >
                Mes: {cronExpression.split(' ')[3]}
              </Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: currentTheme.badge.background,
                  color: currentTheme.badge.text,
                  borderColor: currentTheme.border
                }}
              >
                Día semana: {cronExpression.split(' ')[4]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
          <CardHeader>
            <CardTitle style={{ color: currentTheme.text.primary }}>Ejemplo de Uso</CardTitle>
            <CardDescription style={{ color: currentTheme.text.secondary }}>
              Cómo integrar este componente en tu aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre
              className="p-4 rounded-lg text-sm overflow-x-auto"
              style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.text.primary,
                borderColor: currentTheme.border,
                border: '1px solid'
              }}
            >
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CronBuilderDemo;
