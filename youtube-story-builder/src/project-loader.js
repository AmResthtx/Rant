const fs = require('fs');
const path = require('path');

class ProjectLoader {
  constructor(projectsDir = './projects') {
    this.projectsDir = projectsDir;
  }

  loadProjects() {
    const projects = [];

    // Ensure projects directory exists
    if (!fs.existsSync(this.projectsDir)) {
      fs.mkdirSync(this.projectsDir, { recursive: true });
      console.log(`📁 Created projects directory at ${this.projectsDir}`);
      return projects;
    }

    // Load all .md and .json files from projects directory
    const files = fs.readdirSync(this.projectsDir);

    for (const file of files) {
      const filePath = path.join(this.projectsDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.json'))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const project = this.parseProjectFile(file, content);
          if (project) projects.push(project);
        } catch (error) {
          console.error(`Error loading project ${file}:`, error.message);
        }
      }
    }

    return projects;
  }

  parseProjectFile(fileName, content) {
    if (fileName.endsWith('.json')) {
      return JSON.parse(content);
    } else if (fileName.endsWith('.md')) {
      // Extract title and description from markdown
      const lines = content.split('\n');
      const title = lines.find(l => l.startsWith('#'))?.replace(/^#+\s/, '') || fileName;
      return {
        name: title,
        description: content.substring(0, 500),
        fileName
      };
    }
    return null;
  }

  addProject(projectName, description) {
    const project = {
      name: projectName,
      description,
      createdAt: new Date().toISOString()
    };

    const filePath = path.join(this.projectsDir, `${projectName.toLowerCase().replace(/\s+/g, '-')}.json`);
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2));
    console.log(`✅ Project added: ${filePath}`);
    return project;
  }
}

module.exports = ProjectLoader;
