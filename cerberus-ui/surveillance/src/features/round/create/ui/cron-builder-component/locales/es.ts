export const es = {
    // Labels de campos
    minutes: 'Minutos',
    hours: 'Horas',
    dayOfMonth: 'Día del mes',
    month: 'Mes',
    dayOfWeek: 'Día de la semana',

    // Presets de frecuencia
    minutely: 'Cada minuto',
    hourly: 'Cada hora',
    daily: 'Cada día',
    weekly: 'Cada semana',
    monthly: 'Cada mes',
    yearly: 'Cada año',

    // Tipos de campo
    every: 'Todos',
    specific: 'Valores específicos',
    range: 'Rango',
    interval: 'Cada X',

    // Meses
    months: {
        jan: 'ENE',
        feb: 'FEB',
        mar: 'MAR',
        apr: 'ABR',
        may: 'MAY',
        jun: 'JUN',
        jul: 'JUL',
        aug: 'AGO',
        sep: 'SEP',
        oct: 'OCT',
        nov: 'NOV',
        dec: 'DIC',
    },

    monthsFull: {
        january: 'Enero',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Agosto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Diciembre',
    },

    monthsLowercase: [
        '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],

    // Días de la semana
    weekdays: {
        sun: 'DOM',
        mon: 'LUN',
        tue: 'MAR',
        wed: 'MIÉ',
        thu: 'JUE',
        fri: 'VIE',
        sat: 'SÁB',
    },

    weekdaysFull: {
        sunday: 'Domingo',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
    },

    weekdaysLowercase: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],

    // Interfaz
    selectValues: 'Selecciona valores:',
    selected: 'seleccionado',
    selectedPlural: 'seleccionados',
    values: 'Valores:',
    clear: 'Limpiar',
    reset: 'Restablecer',
    rangeLabel: 'Rango:',
    everyLabel: 'Cada:',
    tooltip: 'Ajusta los valores específicos para tu frecuencia seleccionada',
    nextExecutions: 'Próximas ejecuciones:',
    invalidCron: 'Expresión CRON inválida',

    // Descripciones de CRON
    cronDescriptions: {
        everyMinute: 'Cada minuto',
        everyHourAtMinute: 'Cada hora en punto',
        everyDayAtMidnight: 'Todos los días a medianoche',
        weekdaysAt: 'de lunes a viernes',
        weekendsAt: 'los fines de semana',
        atTime: 'A las',
        inMinute: 'En el minuto',
        ofEveryHour: 'de cada hora',
        everyMinuteOf: 'Cada minuto de las',
        everyNMinutes: 'Cada',
        minutes: 'minutos',
        everyNHours: 'Cada',
        hours: 'horas',
        onDays: 'los días',
        ofTheMonth: 'del mes',
        fromDay: 'del día',
        toDay: 'al',
        everyNDays: 'cada',
        days: 'días',
        onDay: 'el día',
        from: 'de',
        to: 'a',
        in: 'en',
        and: 'y',
        errorCalculating: 'Error calculando próximas ejecuciones',
    },

    // Validaciones
    validations: {
        mustHave5Parts: 'La expresión CRON debe tener 5 partes',
        invalidMinutes: 'Minutos inválidos (0-59)',
        invalidHours: 'Horas inválidas (0-23)',
        invalidDayOfMonth: 'Día del mes inválido (1-31)',
        invalidMonth: 'Mes inválido (1-12)',
        invalidDayOfWeek: 'Día de la semana inválido (0-6)',
    },
};

export type Locale = typeof es;
