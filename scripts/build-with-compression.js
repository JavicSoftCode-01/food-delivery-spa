#!/usr/bin/env node
// scripts/build-with-compression.js
// Script para build con compresión Brotli automática

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { gzip, brotliCompress } from 'zlib';
import { promisify } from 'util';

// Obtener __dirname equivalente en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisificar las funciones de compresión
const gzipAsync = promisify(gzip);
const brotliCompressAsync = promisify(brotliCompress);

console.log('🚀 Build con compresión automática...\n');

async function compressFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    
    // Compresión Gzip
    const gzipResult = await gzipAsync(content, { level: 9 });
    
    // Compresión Brotli
    const brotliResult = await brotliCompressAsync(content, { 
      params: {
        [brotliCompressAsync.constants.BROTLI_PARAM_QUALITY]: 11,
        [brotliCompressAsync.constants.BROTLI_PARAM_MODE]: brotliCompressAsync.constants.BROTLI_MODE_GENERIC
      }
    });
    
    return {
      gzipSize: gzipResult.length,
      brotliSize: brotliResult.length
    };
  } catch (error) {
    console.warn(`⚠️ Error comprimiendo ${filePath}:`, error.message);
    return { gzipSize: 0, brotliSize: 0 };
  }
}

async function compressAssets(distPath) {
  console.log('📦 Comprimiendo assets...');
  
  const assetsDir = path.join(distPath, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ No se encontró la carpeta assets');
    return;
  }
  
  const files = fs.readdirSync(assetsDir);
  const compressibleExtensions = ['.js', '.css', '.html'];
  
  let totalOriginalSize = 0;
  let totalGzipSize = 0;
  let totalBrotliSize = 0;
  let compressedFiles = 0;
  
  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const ext = path.extname(file);
    
    if (compressibleExtensions.includes(ext)) {
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      
      const { gzipSize, brotliSize } = await compressFile(filePath);
      
      if (gzipSize > 0 && brotliSize > 0) {
        // Guardar archivos comprimidos
        fs.writeFileSync(filePath + '.gz', await gzipAsync(fs.readFileSync(filePath), { level: 9 }));
        fs.writeFileSync(filePath + '.br', await brotliCompressAsync(fs.readFileSync(filePath), { 
          params: {
            [brotliCompressAsync.constants.BROTLI_PARAM_QUALITY]: 11
          }
        }));
        
        totalOriginalSize += originalSize;
        totalGzipSize += gzipSize;
        totalBrotliSize += brotliSize;
        compressedFiles++;
        
        const gzipRatio = ((1 - gzipSize / originalSize) * 100).toFixed(1);
        const brotliRatio = ((1 - brotliSize / originalSize) * 100).toFixed(1);
        
        console.log(`✅ ${file.padEnd(30)} ${(originalSize / 1024).toFixed(2).padStart(8)} KB → Gzip: ${gzipRatio.padStart(5)}% | Brotli: ${brotliRatio.padStart(5)}%`);
      }
    }
  }
  
  console.log('\n📊 Resumen de compresión:');
  console.log('============================');
  console.log(`Archivos comprimidos: ${compressedFiles}`);
  console.log(`Tamaño original: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`Tamaño Gzip: ${(totalGzipSize / 1024).toFixed(2)} KB (${((1 - totalGzipSize / totalOriginalSize) * 100).toFixed(1)}% reducción)`);
  console.log(`Tamaño Brotli: ${(totalBrotliSize / 1024).toFixed(2)} KB (${((1 - totalBrotliSize / totalOriginalSize) * 100).toFixed(1)}% reducción)`);
  
  // Ahorro total
  const gzipSavings = totalOriginalSize - totalGzipSize;
  const brotliSavings = totalOriginalSize - totalBrotliSize;
  console.log(`\n💰 Ahorro total:`);
  console.log(`Gzip: ${(gzipSavings / 1024).toFixed(2)} KB`);
  console.log(`Brotli: ${(brotliSavings / 1024).toFixed(2)} KB`);
}

async function main() {
  try {
    // Ejecutar build
    console.log('🔨 Ejecutando build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Comprimir assets
    const distPath = path.join(process.cwd(), 'dist');
    await compressAssets(distPath);
    
    console.log('\n🎉 ¡Build con compresión completado!');
    console.log('\n💡 Para usar la compresión en producción:');
    console.log('   - Configura tu servidor para servir archivos .gz y .br');
    console.log('   - Agrega headers Accept-Encoding: gzip, br');
    console.log('   - Prioriza Brotli sobre Gzip para mejor compresión');
    
  } catch (error) {
    console.error('❌ Error durante el build con compresión:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
