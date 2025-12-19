import { Step, StepType } from '../types/index';

export function parseXml(response: string): Step[] {

  const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*)/);

  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  const titleMatch = response.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });


  const completeActionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;
  let lastIndex = 0;

  while ((match = completeActionRegex.exec(xmlContent)) !== null) {
    const [fullMatch, type, filePath, content] = match;
    lastIndex = match.index + fullMatch.length;

    if (type === 'file') {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'completed',
        code: content.trim(),
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'completed',
        code: content.trim()
      });
    }
  }

  const remainingContent = xmlContent.slice(lastIndex);
  const pendingActionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*)/;
  const pendingMatch = remainingContent.match(pendingActionRegex);

  if (pendingMatch) {
    const [, type, filePath, content] = pendingMatch;

    if (type === 'file') {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        // Don't trim end of streaming content to preserve typing flow
        code: content.replace(/^\n/, ''),
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content.replace(/^\n/, '')
      });
    }
  }

  return steps;
}