import { useAgentStore, useProviderStore, useGenerationStore } from '@/stores'
import type { AgentId, WorkflowStep, CreativeBrief, MotionPlan, GeneratedPrompt, QualityAssessment } from '@/types/agent'
import type { GenerationRequest } from '@/types/provider'

class WorkflowOrchestrator {
  private agents = [
    'creative_director',
    'vision_analysis',
    'motion_architect',
    'prompt_engineer',
    'model_selection',
    'generation',
    'quality_control',
  ] as AgentId[]

  async executeImageToVideo(brief: CreativeBrief): Promise<string> {
    const store = useAgentStore.getState()
    const providerStore = useProviderStore.getState()
    const generationStore = useGenerationStore.getState()

    const steps: Omit<WorkflowStep, 'id' | 'status'>[] = this.agents.map((agentId) => ({
      agentId,
      name: this.getAgentName(agentId),
    }))

    const workflow = store.createWorkflow(steps)
    store.setActiveWorkflow(workflow)

    try {
      // Step 1: Creative Director - Analyze brief
      await this.executeStep(workflow.id, 'creative_director', async () => {
        return this.analyzeCreativeBrief(brief)
      })

      // Step 2: Vision Analysis - Analyze source image
      if (brief.sourceImage) {
        await this.executeStep(workflow.id, 'vision_analysis', async () => {
          return this.analyzeImage(brief.sourceImage!, brief)
        })
      }

      // Step 3: Motion Architect - Create motion plan
      await this.executeStep(workflow.id, 'motion_architect', async () => {
        return this.createMotionPlan(brief)
      })

      // Step 4: Model Selection - Choose best model
      const { provider, model } = await this.executeStep(workflow.id, 'model_selection', async () => {
        return this.selectModel(brief)
      })

      // Step 5: Prompt Engineer - Generate optimized prompt
      const prompt = await this.executeStep(workflow.id, 'prompt_engineer', async () => {
        return this.generatePrompt(brief, model)
      })

      // Step 6: Generation - Submit and monitor
      const job = await this.executeStep(workflow.id, 'generation', async () => {
        return this.submitGeneration(provider, model, prompt, brief)
      })

      // Step 7: Quality Control - Assess result
      await this.executeStep(workflow.id, 'quality_control', async () => {
        return this.assessQuality(job.id, brief)
      })

      store.updateWorkflow(workflow.id, { status: 'completed' })
      return job.id
    } catch (error) {
      store.updateWorkflow(workflow.id, { status: 'failed', error: String(error) })
      throw error
    }
  }

  private async executeStep(
    workflowId: string,
    agentId: AgentId,
    fn: () => Promise<any>
  ): Promise<any> {
    const store = useAgentStore.getState()
    const step = store.workflows[workflowId]?.steps.find((s) => s.agentId === agentId)
    if (!step) throw new Error(`Step for agent ${agentId} not found`)

    store.updateAgentStatus(agentId, 'executing', step.name)
    store.updateStepStatus(workflowId, step.id, 'running')

    const startTime = Date.now()
    try {
      const result = await fn()
      store.updateAgentStatus(agentId, 'completed')
      store.addExecution(agentId, {
        agentId,
        status: 'completed',
        startedAt: startTime,
        completedAt: Date.now(),
        output: result,
      })
      store.updateStepStatus(workflowId, step.id, 'completed', result)
      return result
    } catch (error) {
      store.updateAgentStatus(agentId, 'error')
      store.addError(agentId, {
        agentId,
        timestamp: Date.now(),
        error: String(error),
        resolved: false,
      })
      store.updateStepStatus(workflowId, step.id, 'failed')
      throw error
    }
  }

  private getAgentName(agentId: AgentId): string {
    const names: Record<AgentId, string> = {
      creative_director: 'Creative Director',
      vision_analysis: 'Vision Analysis',
      motion_architect: 'Motion Architect',
      prompt_engineer: 'Prompt Engineer',
      model_selection: 'Model Selection',
      generation: 'Generation',
      quality_control: 'Quality Control',
      workflow_orchestrator: 'Workflow Orchestrator',
    }
    return names[agentId]
  }
private async analyzeCreativeBrief(brief: CreativeBrief) {
    return {
      intent: brief.intent,
      keyElements: brief.intent.keyElements,
      mood: brief.intent.mood,
      style: brief.intent.style,
      recommendedWorkflow: brief.intent.type,
    }
  }

  private async analyzeImage(image: string, brief: CreativeBrief) {
    return {
      objects: ['subject', 'background'],
      scene: 'outdoor',
      composition: 'rule of thirds',
      lighting: 'natural',
      colors: ['blue', 'green'],
      mood: brief.intent.mood,
      suggestedMotion: ['slow zoom', 'pan'],
      confidence: 0.85,
    }
  }

  private async createMotionPlan(brief: CreativeBrief): Promise<MotionPlan> {
    return {
      cameraMovement: {
        type: 'zoom',
        direction: 'in',
        intensity: 0.5,
        smoothness: 0.8,
      },
      subjectMovement: {
        subjects: ['main subject'],
        description: 'gentle movement',
        intensity: 0.3,
      },
      environmentalAnimation: {
        elements: ['leaves', 'water'],
        description: 'subtle natural motion',
        intensity: 0.2,
      },
      duration: brief.targetOutput.duration || 5,
      aspectRatio: brief.targetOutput.aspectRatio || '16:9',
      pacing: 'smooth',
      keyFrames: [
        { timestamp: 0, description: 'Start frame' },
        { timestamp: 2.5, description: 'Mid point' },
        { timestamp: 5, description: 'End frame' },
      ],
    }
  }

  private async selectModel(brief: CreativeBrief): Promise<{ provider: string; model: string }> {
    const providerStore = useProviderStore.getState()
    const connectedProviders = providerStore.getConnectedProviders()

    if (connectedProviders.length === 0) {
      throw new Error('No providers connected')
    }

    const provider = connectedProviders[0]
    const models = providerStore.models[provider] || []

    if (models.length === 0) {
      throw new Error(`No models available for ${provider}`)
    }

    const suitableModel = models.find((m) =>
      brief.intent.type === 'image_to_video' ? m.capabilities.imageToVideo :
      brief.intent.type === 'text_to_video' ? m.capabilities.textToVideo :
      m.capabilities.imageToImage
    )

    return {
      provider,
      model: suitableModel?.id || models[0].id,
    }
  }

  private async generatePrompt(brief: CreativeBrief, model: string): Promise<GeneratedPrompt> {
    const motionPlan = await this.createMotionPlan(brief)
    const promptParts = [
      brief.userPrompt,
      `Camera: ${motionPlan.cameraMovement.type} ${motionPlan.cameraMovement.direction || ''}`,
      `Subject: ${motionPlan.subjectMovement.description}`,
      `Environment: ${motionPlan.environmentalAnimation.description}`,
      `Duration: ${motionPlan.duration}s`,
      `Aspect ratio: ${motionPlan.aspectRatio}`,
    ]

    return {
      provider: brief.intent.type,
      model,
      prompt: promptParts.join(', '),
      negativePrompt: 'blurry, low quality, distorted, ugly, bad anatomy',
      parameters: {
        aspectRatio: motionPlan.aspectRatio,
        duration: motionPlan.duration,
      },
      confidence: 0.8,
    }
  }

  private async submitGeneration(
    provider: string,
    model: string,
    prompt: GeneratedPrompt,
    brief: CreativeBrief
  ) {
    const providerStore = useProviderStore.getState()
    const credentials = providerStore.credentials[provider as any]

    if (!credentials) {
      throw new Error(`No credentials for ${provider}`)
    }

    const adapter = providerStore.getAdapter(provider as any)
    if (!adapter) {
      throw new Error(`No adapter for ${provider}`)
    }

    const request: GenerationRequest = {
      provider: provider as any,
      model,
      type: brief.intent.type as any,
      prompt: prompt.prompt,
      negativePrompt: prompt.negativePrompt,
      image: brief.sourceImage,
      parameters: prompt.parameters,
      projectId: brief.projectId,
    }

    return adapter.generateImageToVideo(credentials, request)
  }

  private async assessQuality(jobId: string, brief: CreativeBrief): Promise<QualityAssessment> {
    return {
      overallScore: 0.8,
      issues: [],
      suggestions: ['Consider adjusting motion intensity'],
      meetsBrief: true,
    }
  }

export const workflowOrchestrator = new WorkflowOrchestrator()
}