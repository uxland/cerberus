"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_swc_1 = require("@vitejs/plugin-react-swc");
var path_1 = require("path");
var url_1 = require("url");
var __dirname = (0, url_1.fileURLToPath)(new URL('.', import.meta.url));
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_swc_1.default)()],
    build: {
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src/lib/index.ts'),
            name: 'CerberusCalendar',
            fileName: function (format) { return "cerberus-calendar.".concat(format, ".js"); }
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'lucide-react',
                'date-fns',
                'date-fns/locale',
                'class-variance-authority',
                'clsx',
                'tailwind-merge'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'react/jsx-runtime',
                    'lucide-react': 'LucideReact',
                    'date-fns': 'dateFns',
                    'class-variance-authority': 'cva',
                    'clsx': 'clsx',
                    'tailwind-merge': 'tailwindMerge'
                }
            }
        },
        cssCodeSplit: false
    },
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, './src')
        }
    }
});
