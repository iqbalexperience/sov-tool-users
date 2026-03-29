"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getProjectMemberIdsAction, updateProjectMembersAction } from "./actions";
import { toast } from "sonner";

interface ProjectUsersDialogProps {
  clientId: string;
  projectId: string;
  projectName: string;
  organizationMembers: { id: string; name: string; email: string; role: string }[];
  children: React.ReactNode;
}

export function ProjectUsersDialog({ clientId, projectId, projectName, organizationMembers, children }: ProjectUsersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getProjectMemberIdsAction(clientId, projectId).then((res) => {
        if (res.success) {
          setSelectedIds(res.selectedMemberIds || []);
        } else {
          toast.error(res.error || "Failed to load members");
        }
        setLoading(false);
      });
    }
  }, [isOpen, clientId, projectId]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredMembers = organizationMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    const filteredIds = filteredMembers.map(m => m.id);
    setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
  };

  const handleUnselectAll = () => {
    const filteredIds = new Set(filteredMembers.map(m => m.id));
    setSelectedIds(prev => prev.filter(id => !filteredIds.has(id)));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateProjectMembersAction(clientId, projectId, selectedIds);
    setSaving(false);
    if (res.success) {
      toast.success("Users updated successfully");
      setIsOpen(false);
    } else {
      toast.error(res.error || "Failed to update users");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={true} className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">{projectName}</DialogTitle>
            <DialogDescription className="text-sm mt-1.5">
              Manage users for this project.
            </DialogDescription>
          </DialogHeader>

        {!loading && organizationMembers.length > 0 && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-row justify-between items-center text-sm px-1">
              <span className="text-muted-foreground">{filteredMembers.length} users</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-8 text-xs">Select All</Button>
                <Button variant="ghost" size="sm" onClick={handleUnselectAll} className="h-8 text-xs">Unselect All</Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 min-h-[30vh] max-h-[40vh] overflow-y-auto no-scrollbar pb-2">
          {loading ? (
            <div className="flex justify-center items-center h-24 text-sm text-muted-foreground">Loading users...</div>
          ) : organizationMembers.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center pt-8">No organization members found.</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center pt-8">No users found for "{searchQuery}".</div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredMembers.map(member => (
                <label key={member.id} className="flex items-center gap-3 p-3 rounded-xl border shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(member.id)}
                    onChange={() => toggleSelection(member.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary outline-hidden"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm leading-none">{member.name}</span>
                    <span className="text-xs text-muted-foreground mt-1.5">{member.email}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-t">
          <p className="text-sm text-muted-foreground mr-4">
            Select the checkboxes to manage project access.
          </p>
          <Button onClick={handleSave} disabled={loading || saving} className="sm:w-auto">
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
