import { Locale } from './es';

export const ca: Locale = {
    // Etiquetes dels camps
    minutes: 'Minuts',
    hours: 'Hores',
    dayOfMonth: 'Dia del mes',
    month: 'Mes',
    dayOfWeek: 'Dia de la setmana',

    // Presets de freqüència
    minutely: 'Cada minut',
    hourly: 'Cada hora',
    daily: 'Cada dia',
    weekly: 'Cada setmana',
    monthly: 'Cada mes',
    yearly: 'Cada any',

    // Tipus de camp
    every: 'Tots',
    specific: 'Valors específics',
    range: 'Rang',
    interval: 'Cada X',

    // Mesos
    months: {
        jan: 'GEN',
        feb: 'FEB',
        mar: 'MAR',
        apr: 'ABR',
        may: 'MAI',
        jun: 'JUN',
        jul: 'JUL',
        aug: 'AGO',
        sep: 'SET',
        oct: 'OCT',
        nov: 'NOV',
        dec: 'DES',
    },

    monthsFull: {
        january: 'Gener',
        february: 'Febrer',
        march: 'Març',
        april: 'Abril',
        may: 'Maig',
        june: 'Juny',
        july: 'Juliol',
        august: 'Agost',
        september: 'Setembre',
        october: 'Octubre',
        november: 'Novembre',
        december: 'Desembre',
    },

    monthsLowercase: [
        '', 'gener', 'febrer', 'març', 'abril', 'maig', 'juny',
        'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'
    ],

    // Dies de la setmana
    weekdays: {
        sun: 'DIG',
        mon: 'DIL',
        tue: 'DIM',
        wed: 'DIC',
        thu: 'DIJ',
        fri: 'DIV',
        sat: 'DIS',
    },

    weekdaysFull: {
        sunday: 'Diumenge',
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wednesday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres',
        saturday: 'Dissabte',
    },

    weekdaysLowercase: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],

    // Interfície
    selectValues: 'Selecciona valors:',
    selected: 'seleccionat',
    selectedPlural: 'seleccionats',
    values: 'Valors:',
    clear: 'Netejar',
    reset: 'Restablir',
    rangeLabel: 'Rang:',
    everyLabel: 'Cada:',
    tooltip: 'Ajusta els valors específics per a la teva freqüència seleccionada',
    nextExecutions: 'Properes execucions:',
    invalidCron: 'Expressió CRON invàlida',

    // Descripcions de CRON
    cronDescriptions: {
        everyMinute: 'Cada minut',
        everyHourAtMinute: 'Cada hora en punt',
        everyDayAtMidnight: 'Cada dia a mitjanit',
        weekdaysAt: 'de dilluns a divendres',
        weekendsAt: 'els caps de setmana',
        atTime: 'A les',
        inMinute: 'Al minut',
        ofEveryHour: 'de cada hora',
        everyMinuteOf: 'Cada minut de les',
        everyNMinutes: 'Cada',
        minutes: 'minuts',
        everyNHours: 'Cada',
        hours: 'hores',
        onDays: 'els dies',
        ofTheMonth: 'del mes',
        fromDay: 'del dia',
        toDay: 'al',
        everyNDays: 'cada',
        days: 'dies',
        onDay: 'el dia',
        from: 'de',
        to: 'a',
        in: 'en',
        and: 'i',
        errorCalculating: 'Error calculant properes execucions',
    },

    // Validacions
    validations: {
        mustHave5Parts: 'L\'expressió CRON ha de tenir 5 parts',
        invalidMinutes: 'Minuts invàlids (0-59)',
        invalidHours: 'Hores invàlides (0-23)',
        invalidDayOfMonth: 'Dia del mes invàlid (1-31)',
        invalidMonth: 'Mes invàlid (1-12)',
        invalidDayOfWeek: 'Dia de la setmana invàlid (0-6)',
    },
};
