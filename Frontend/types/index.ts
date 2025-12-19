export interface FileNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileNode[]
}

export interface FileContent {
  path: string
  content: string
}

export interface BuildStep {
  name: string
  status: "pending" | "in-progress" | "completed"
}

export interface GeneratedProject {
  prompt: string
  fileTree: FileNode[]
  files: FileContent[]
  buildSteps: BuildStep[]
  previewUrl?: string
}


