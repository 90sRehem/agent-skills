#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI colors
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function getSkillsDir() {
  const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(xdgConfig, 'opencode', 'skills');
}

function findSkills() {
  const skillsFound = [];
  
  try {
    const entries = fs.readdirSync(__dirname, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const skillPath = path.join(__dirname, entry.name);
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      
      if (fs.existsSync(skillMdPath)) {
        skillsFound.push(entry.name);
      }
    }
  } catch (err) {
    log(`Error scanning skills directory: ${err.message}`, 'yellow');
  }
  
  return skillsFound.sort();
}

function installSkills() {
  const skillsDir = getSkillsDir();
  const skills = findSkills();
  
  if (skills.length === 0) {
    log('No skills found in repository.', 'yellow');
    return;
  }
  
  log(`\nInstalling agent-skills to: ${skillsDir}\n`, 'blue');
  
  // Create skills directory if it doesn't exist
  try {
    fs.mkdirSync(skillsDir, { recursive: true });
  } catch (err) {
    log(`Error creating skills directory: ${err.message}`, 'yellow');
    process.exit(1);
  }
  
  let installedCount = 0;
  
  // Install each skill
  for (const skill of skills) {
    const src = path.join(__dirname, skill);
    const dest = path.join(skillsDir, skill);
    
    try {
      fs.cpSync(src, dest, { recursive: true });
      log(`✓ ${skill}`, 'green');
      installedCount++;
    } catch (err) {
      log(`✗ ${skill}: ${err.message}`, 'yellow');
    }
  }
  
  // Install _shared directory
  const sharedSrc = path.join(__dirname, '_shared');
  if (fs.existsSync(sharedSrc)) {
    const sharedDest = path.join(skillsDir, '_shared');
    try {
      fs.cpSync(sharedSrc, sharedDest, { recursive: true });
      log(`✓ _shared`, 'green');
    } catch (err) {
      log(`✗ _shared: ${err.message}`, 'yellow');
    }
  }
  
  // Install commands directory
  const commandsSrc = path.join(__dirname, 'commands');
  if (fs.existsSync(commandsSrc)) {
    const commandsDest = path.join(skillsDir, 'commands');
    try {
      fs.cpSync(commandsSrc, commandsDest, { recursive: true });
      log(`✓ commands`, 'green');
    } catch (err) {
      log(`✗ commands: ${err.message}`, 'yellow');
    }
  }
  
  log(`\n${colors.bold}Summary:${colors.reset}`);
  log(`Installed ${installedCount} skill(s) + utilities to ${skillsDir}`, 'green');
}

installSkills();
