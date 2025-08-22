#!/usr/bin/env node
// scripts/build-analyze.js
// Script para analizar el bundle después del build

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analizando bundle size...\n');

try {
  // Ejecutar build
  console.log('📦 Ejecutando build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Analizar dist folder recursivamente
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...walkDir(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }
  
  const distPath = path.join(process.cwd(), 'dist');
  const allFiles = walkDir(distPath);
  
  // Construir stats
  let totalSize = 0;
  const fileStats = allFiles.map((filePath) => {
    const stats = fs.statSync(filePath);
    const relativePath = path.relative(distPath, filePath).replace(/\\/g, '/');
    totalSize += stats.size;
    return {
      name: relativePath,
      size: stats.size,
      sizeKB: +(stats.size / 1024).toFixed(2)
    };
  }).sort((a, b) => b.size - a.size);
  
  console.log('\n📊 Análisis de archivos generados:');
  console.log('=====================================');
  fileStats.forEach(f => {
    console.log(`${f.name.padEnd(40)} ${String(f.sizeKB).padStart(8)} KB`);
  });
  
  console.log('\n🏆 Top 10 archivos más grandes:');
  console.log('================================');
  fileStats.slice(0, 10).forEach((file, index) => {
    const medals = ['🥇','🥈','🥉'];
    const icon = medals[index] || '📄';
    console.log(`${icon} ${file.name.padEnd(35)} ${String(file.sizeKB).padStart(8)} KB`);
  });
  
  console.log('\n📈 Resumen:');
  console.log('============');
  console.log(`Total de archivos: ${allFiles.length}`);
  console.log(`Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Tamaño promedio: ${(totalSize / allFiles.length / 1024).toFixed(2)} KB`);
  
  // Verificar chunks JS reales
  const jsFiles = fileStats.filter(f => f.name.endsWith('.js'));
  console.log(`\n🧩 Chunks JS: ${jsFiles.length}`);
  if (jsFiles.length > 15) {
    console.log('⚠️  Demasiados chunks JS. Considera consolidar (agrupa features).');
  } else if (jsFiles.length < 5) {
    console.log('⚠️  Pocos chunks. Considera dividir para mejor caching.');
  } else {
    console.log('✅ Número de chunks optimizado');
  }
  
  // Resumen por carpeta
  const byDir = new Map();
  for (const f of fileStats) {
    const dirName = path.dirname(f.name);
    byDir.set(dirName, (byDir.get(dirName) || 0) + f.size);
  }
  console.log('\n🗂️  Tamaño por carpeta:');
  for (const [dir, size] of byDir) {
    console.log(`${dir.padEnd(30)} ${(size / 1024).toFixed(2).padStart(8)} KB`);
  }
  
  // Recomendaciones
  console.log('\n💡 Recomendaciones:');
  console.log('====================');
  
  if (totalSize > 2 * 1024 * 1024) { // > 2MB
    console.log('⚠️  Bundle muy grande. Considera:');
    console.log('   - Implementar lazy loading más agresivo');
    console.log('   - Dividir en chunks más pequeños');
    console.log('   - Optimizar dependencias');
  } else if (totalSize > 1 * 1024 * 1024) { // > 1MB
    console.log('⚠️  Bundle grande. Considera:');
    console.log('   - Revisar imports innecesarios');
    console.log('   - Implementar tree shaking');
  } else {
    console.log('✅ Bundle size optimizado');
  }
  
} catch (error) {
  console.error('❌ Error durante el análisis:', error.message);
  process.exit(1);
}
