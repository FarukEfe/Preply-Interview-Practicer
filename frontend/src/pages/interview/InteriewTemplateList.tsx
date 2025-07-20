import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"
import {
  Building2,
  Phone,
  Video,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  Copy,
  Trash2,
  Plus,
  Eye,
} from "lucide-react"

// Interview template interface based on your structure
export interface InterviewTemplate {
  interview_flow_id: string
  title: string
  org_name: string
  questions: string[]
  is_phone_call_enabled: boolean
  is_video_enabled: boolean
  is_doc_upload_enabled: boolean
  createdAt: string
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

interface InterviewTemplateItemProps {
  template: InterviewTemplate
  onEdit?: (template: InterviewTemplate) => void
  onCopy?: (template: InterviewTemplate) => void
  onDelete?: (templateId: string) => void
  onUse: (template: InterviewTemplate) => void
  showQuestions?: boolean
}

function InterviewTemplateItem({
  template,
  showQuestions = false,
  onUse,
}: InterviewTemplateItemProps) {
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(showQuestions)

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{template.org_name}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(template.createdAt)}</span>
              <span>•</span>
              <span>{template.questions.length} questions</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button size="sm" onClick={() => {
              // Create interview instance to backend
              // Navigate user to interview in a new window
              console.log(template);
              onUse(template);
            }}>
              Start Interview
            </Button>
            {/* <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete}>
              <Trash2 className="h-3 w-3" />
            </Button> */}
          </div>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-1 text-xs ${template.is_phone_call_enabled ? "text-green-600" : "text-muted-foreground"}`}
            >
              <Phone className="h-3 w-3" />
              <span>Phone</span>
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${template.is_video_enabled ? "text-green-600" : "text-muted-foreground"}`}
            >
              <Video className="h-3 w-3" />
              <span>Video</span>
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${template.is_doc_upload_enabled ? "text-green-600" : "text-muted-foreground"}`}
            >
              <FileText className="h-3 w-3" />
              <span>Docs</span>
            </div>
          </div>
        </div>

        {/* Expandable Questions Section - Only show if showQuestions is true */}
        {showQuestions && (
          <Collapsible open={isQuestionsExpanded} onOpenChange={setIsQuestionsExpanded}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isQuestionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span>View {template.questions.length} questions</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="bg-muted/50 rounded-md p-3 space-y-2">
                {template.questions.map((question, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground font-mono text-xs mt-0.5">
                      {(index + 1).toString().padStart(2, "0")}.
                    </span>
                    <span className="flex-1">{question}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </Card>
  )
}

interface InterviewTemplateListProps {
  templates: InterviewTemplate[]
  onEdit?: (template: InterviewTemplate) => void
  onCopy?: (template: InterviewTemplate) => void
  onDelete?: (templateId: string) => void
  onUse: (template: InterviewTemplate) => void
  onCreateNew?: () => void
  title?: string
}

export function InterviewTemplateList({
  templates,
  onEdit,
  onCopy,
  onDelete,
  onUse,
  onCreateNew,
  title = "Interview Templates",
}: InterviewTemplateListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const visibleTemplates = templates.slice(0, 2) // Show only first 2
  const remainingTemplates = templates.slice(2) // Rest for modal
  const hasMore = templates.length > 2

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{templates.length} templates</Badge>
        </div>
      </div>

      {/* Show first 2 templates */}
      <div className="flex gap-4 overflow-x-auto">
        {visibleTemplates.map((template) => (
          <InterviewTemplateItem
            key={template.interview_flow_id}
            template={template}
            onEdit={onEdit}
            onCopy={onCopy}
            onDelete={onDelete}
            onUse={onUse}
          />
        ))}
      </div>

      {/* See More Button with Modal */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>See {remainingTemplates.length} more templates</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl">All Interview Templates</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] px-6 pb-6">
                <div className="space-y-4">
                  {/* Show all templates in modal with questions expandable */}
                  {templates.map((template) => (
                    <InterviewTemplateItem
                      key={template.interview_flow_id}
                      template={template}
                      onEdit={onEdit}
                      onCopy={onCopy}
                      onDelete={onDelete}
                      onUse={onUse}
                      showQuestions={true} // Enable questions expansion in modal
                    />
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Show message if no templates */}
      {templates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No interview templates found.</p>
          <Button onClick={onCreateNew} className="mt-2">
            Create your first template
          </Button>
        </div>
      )}
    </div>
  )
}
