#!/bin/bash

# Script para preparar y publicar la librería Cerberus Calendar

echo "🔧 Preparando la librería Cerberus Calendar..."

# Limpiar dist anterior
echo "🧹 Limpiando directorio dist..."
rm -rf dist

# Construir la librería
echo "🏗️  Construyendo la librería..."
npm run build:lib

# Verificar que se crearon los archivos
if [ ! -f "dist/cerberus-calendar.es.js" ] || [ ! -f "dist/cerberus-calendar.umd.js" ]; then
    echo "❌ Error: No se pudieron generar los archivos de la librería"
    exit 1
fi

echo "✅ Librería construida exitosamente!"
echo "📁 Archivos generados:"
ls -la dist/

echo ""
echo "📦 Para publicar en npm:"
echo "   npm publish"
echo ""
echo "📦 Para crear un paquete local:"
echo "   npm pack"
echo ""
echo "📦 Para instalar localmente en otra app:"
echo "   npm install /ruta/a/uxland-cerberus-calendar-1.0.0.tgz"
echo ""
echo "🎉 ¡Listo para usar!"
