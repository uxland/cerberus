import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/index.ts'),
            name: 'CerberusCalendar',
            fileName: (format) => `cerberus-calendar.${format}.js`
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
            '@': resolve(__dirname, './src')
        }
    }
})