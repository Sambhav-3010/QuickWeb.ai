import { FileItem, Step } from '@/types';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildFileTreeFromSteps(steps: Step[]): FileItem[] {
  const root: FileItem[] = [];

  for (const step of steps) {
    if (!step.path || !step.code) continue;

    const parts = step.path.split("/");
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const fullPath = parts.slice(0, index + 1).join("/");

      let node = current.find((n) => n.name === part);

      if (!node) {
        node = {
          name: part,
          path: fullPath,
          type: isFile ? "file" : "folder",
          content: isFile ? step.code : undefined,
          children: isFile ? undefined : [],
        };
        current.push(node);
      }

      if (!isFile) current = node.children!;
    });
  }

  return root;
}

export function findFirstFile(nodes: FileItem[]): FileItem | null {
  for (const node of nodes) {
    if (node.type === "file") return node;
    if (node.children) {
      const found = findFirstFile(node.children);
      if (found) return found;
    }
  }
  return null;
}

export function findFileByPath(nodes: FileItem[], path: string): FileItem | null {
  for (const node of nodes) {
    if (node.path === path && node.type === "file") return node;
    if (node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}


export function convertToFileSystemTree(files: any[]): any {
  const tree: any = {};
  
  files.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      
      for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const isFile = i === parts.length - 1;
          
          if (isFile) {
              current[part] = {
                  file: { contents: file.content }
              };
          } else {
              if (!current[part]) {
                  current[part] = { directory: {} };
              }
              current = current[part].directory;
          }
      }
  });


  return tree;
}