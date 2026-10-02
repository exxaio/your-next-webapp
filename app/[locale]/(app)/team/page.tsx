"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  Mail01Icon,
  Shield01Icon,
  AlertCircleIcon,
  CheckmarkBadgeIcon,
  PlusSignIcon,
  Delete02Icon,
  MoreVerticalIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Developer" | "Viewer"
  status: "active" | "pending"
  joined: string
  avatar: string
  initials: string
}

const MEMBERS_DATA: TeamMember[] = [
  {
    id: "mem-1",
    name: "Alex Rivera",
    email: "alex.rivera@acme.ai",
    role: "Owner",
    status: "active",
    joined: "Jan 12, 2026",
    avatar: "",
    initials: "AR",
  },
  {
    id: "mem-2",
    name: "Elena Rostova",
    email: "elena.rostova@acme.ai",
    role: "Admin",
    status: "active",
    joined: "Feb 03, 2026",
    avatar: "",
    initials: "ER",
  },
  {
    id: "mem-3",
    name: "Marcus Chen",
    email: "marcus.chen@acme.ai",
    role: "Developer",
    status: "active",
    joined: "Mar 18, 2026",
    avatar: "",
    initials: "MC",
  },
  {
    id: "mem-4",
    name: "Sarah Lindqvist",
    email: "sarah.l@acme.ai",
    role: "Developer",
    status: "pending",
    joined: "Invited 2d ago",
    avatar: "",
    initials: "SL",
  },
]

export default function TeamPage() {
  const t = useTranslations("Team")
  const [members, setMembers] = React.useState<TeamMember[]>(MEMBERS_DATA)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<
    "Admin" | "Developer" | "Viewer"
  >("Developer")
  const [inviteSent, setInviteSent] = React.useState(false)

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joined: "Just now",
      avatar: "",
      initials: inviteEmail.substring(0, 2).toUpperCase(),
    }

    setMembers((prev) => [...prev, newMember])
    setInviteEmail("")
    setInviteSent(true)
    setTimeout(() => setInviteSent(false), 3000)
  }

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-4 pt-0 md:p-6 md:pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Workspace Organization Overview Banner */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserGroupIcon} className="size-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {t("workspaceName")}
                </span>
                <Badge
                  variant="secondary"
                  className="border-primary/40 bg-primary/5 text-[10px] text-primary"
                >
                  Enterprise Tier
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Organization ID: org_acme_88321a
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-center">
              <span className="block font-semibold text-foreground">
                {members.length}
              </span>
              <span>{t("totalMembers")}</span>
            </div>
            <div className="rounded-md border border-border bg-muted/40 px-3 py-1.5 text-center">
              <span className="block font-semibold text-foreground">
                {10 - members.length}
              </span>
              <span>{t("availableSeats")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Group 1: Invite Member */}
      <div id="invite-section" className="scroll-mt-6 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <HugeiconsIcon icon={Mail01Icon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("inviteMember")}
          </span>
        </div>

        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="mb-4">
            <h3 className="text-base font-semibold">{t("inviteTitle")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("inviteSubtitle")}
            </p>
          </div>

          <form
            onSubmit={handleSendInvite}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs">
                Email Address
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="w-full space-y-1.5 sm:w-40">
              <Label htmlFor="invite-role" className="text-xs">
                {t("role")}
              </Label>
              <Select
                value={inviteRole}
                onValueChange={(val) => setInviteRole(val as any)}
              >
                <SelectTrigger id="invite-role" className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{t("roleAdmin")}</SelectItem>
                  <SelectItem value="Developer">
                    {t("roleDeveloper")}
                  </SelectItem>
                  <SelectItem value="Viewer">{t("roleViewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" size="sm" className="gap-1.5">
              <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
              <span>{t("sendInvite")}</span>
            </Button>
          </form>

          {inviteSent && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-2.5 text-xs text-success">
              <HugeiconsIcon
                icon={CheckmarkBadgeIcon}
                className="size-4 shrink-0"
              />
              <span>Invitation successfully dispatched via email.</span>
            </div>
          )}
        </Card>
      </div>

      {/* Group 2: Members Directory */}
      <div id="members-list" className="scroll-mt-6 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <HugeiconsIcon icon={UserGroupIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("membersList")}
          </span>
        </div>

        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("memberCol")}</TableHead>
                  <TableHead>{t("roleCol")}</TableHead>
                  <TableHead>{t("joinedCol")}</TableHead>
                  <TableHead>{t("statusCol")}</TableHead>
                  <TableHead className="text-right">
                    {t("actionsCol")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-muted text-xs font-semibold">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          member.role === "Owner"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : member.role === "Admin"
                              ? "bg-accent/15 text-accent"
                              : "border-border text-foreground"
                        }
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {member.joined}
                    </TableCell>
                    <TableCell>
                      {member.status === "active" ? (
                        <Badge
                          variant="outline"
                          className="border-success/30 bg-success/5 text-[11px] text-success"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkBadgeIcon}
                            className="mr-1 size-3"
                          />
                          {t("active")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-warning/30 bg-warning/10 text-[11px] text-warning"
                        >
                          {t("pending")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== "Owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <HugeiconsIcon
                                  icon={MoreVerticalIcon}
                                  className="size-4 text-muted-foreground"
                                />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              {t("changeRole")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-danger focus:text-danger"
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                className="mr-1 size-3.5"
                              />
                              {t("removeMember")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Group 3: Permissions Matrix */}
      <div id="permissions" className="scroll-mt-6 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-primary">
            <HugeiconsIcon icon={Shield01Icon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t("permissionsMatrix")}
          </span>
        </div>

        <Card className="border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">
                    {t("permissionFeature")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("roleOwner")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("roleAdmin")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("roleDeveloper")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("roleViewer")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                <TableRow>
                  <TableCell className="font-medium">
                    Model Deployment & Fine-tuning
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    Read-only
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    API Keys & Secret Management
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    Own Keys
                  </TableCell>
                  <TableCell className="text-center text-danger">
                    None
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Billing & Invoices Management
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-danger">
                    None
                  </TableCell>
                  <TableCell className="text-center text-danger">
                    None
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Member Invites & Role Assignment
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-success">
                    Full
                  </TableCell>
                  <TableCell className="text-center text-danger">
                    None
                  </TableCell>
                  <TableCell className="text-center text-danger">
                    None
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Group 4: Danger Zone */}
      <div id="danger-zone" className="scroll-mt-6 space-y-3 pb-8">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-md border border-danger/20 bg-danger/10 text-danger">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-danger uppercase">
            {t("dangerTitle")}
          </span>
        </div>

        <Card className="space-y-6 border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                {t("transferWorkspace")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("transferDesc")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("transferAction")}
            </Button>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-danger">
                {t("deleteWorkspace")}
              </h4>
              <p className="text-xs text-muted-foreground">{t("deleteDesc")}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-danger/30 text-danger hover:bg-danger/10"
            >
              {t("deleteAction")}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
