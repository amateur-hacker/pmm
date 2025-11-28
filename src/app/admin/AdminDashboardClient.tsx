"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, Plus, LogOut } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { deleteCookie } from "cookies-next/client";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  published: number; // 0 for draft, 1 for published
  publishedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  id: string; // UUID
  name: string;
  address: string;
  mobile: string;
  email: string;
  dob: string;
  education: string;
  permanentAddress: string;
  image: string | null;
  donated: number; // Donated field
  type: string;
  createdAt: string;
}

export function AdminDashboardClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<
    "member" | "blog" | "member-bulk" | "blog-bulk" | null
  >(null);
  const [deleteItemName, setDeleteItemName] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/admin/members", {
          credentials: "include", // Include cookies by default
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members. Please try again.");
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs", {
          credentials: "include", // Include cookies by default
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        // Handle both paginated and non-paginated responses
        const blogsData = Array.isArray(data) ? data : data.items || [];
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
    fetchBlogs();
  }, [router]);

  const handleLogout = () => {
    deleteCookie("adminToken");
    router.push("/admin/login");
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies by default
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to delete blog");
      }

      // Update local state
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast("Blog deleted successfully.");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast("Failed to delete blog. Please try again.");
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies by default
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to delete member");
      }

      // Update local state
      setMembers(members.filter((member) => member.id !== id));
      toast("Member deleted successfully.");
    } catch (error) {
      console.error("Error deleting member:", error);
      toast("Failed to delete member. Please try again.");
    }
  };

  const handleBulkDeleteMembers = async (ids: string[]) => {
    try {
      // Delete each selected member
      for (const id of ids) {
        await fetch(`/api/admin/members/${id}`, {
          method: "DELETE",
          credentials: "include", // Include cookies by default
        });
      }

      // Update local state to remove deleted members
      setMembers(members.filter((member) => !ids.includes(member.id)));
      toast(`${ids.length} member(s) deleted successfully.`);
    } catch (error) {
      console.error("Error deleting members:", error);
      toast("Failed to delete some members. Please try again.");
    }
  };

  const handleBulkDeleteBlogs = async (ids: string[]) => {
    try {
      // Delete each selected blog
      for (const id of ids) {
        await fetch(`/api/blogs/${id}`, {
          method: "DELETE",
          credentials: "include", // Include cookies by default
        });
      }

      // Update local state to remove deleted blogs
      setBlogs(blogs.filter((blog) => !ids.includes(blog.id)));
      toast(`${ids.length} blog(s) deleted successfully.`);
    } catch (error) {
      console.error("Error deleting blogs:", error);
      toast("Failed to delete some blogs. Please try again.");
    }
  };

  // Define member columns for the data table
  const memberColumns: ColumnDef<Member>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ table, row }) => {
        const currentPage = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return currentPage * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "education",
      header: "Education",
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ row }) => new Date(row.original.dob).toLocaleDateString(),
    },
    {
      accessorKey: "donated",
      header: "Donated",
      cell: ({ row }) => `₹${row.original.donated || 0}`,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="flex space-x-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-600 cursor-pointer"
            >
              <Link href={`/admin/members/${member.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-600 cursor-pointer"
            >
              <Link href={`/admin/members/${member.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteItemId(member.id);
                setDeleteItemType("member");
                setDeleteItemName(member.name);
                setDeleteDialogOpen(true);
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Define blog columns for the data table
  const blogColumns: ColumnDef<Blog>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "serialNumber",
      header: "S.No",
      cell: ({ table, row }) => {
        const currentPage = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return currentPage * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            row.original.published === 1
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.published === 1 ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex space-x-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-600 cursor-pointer"
            >
              <Link href={`/admin/blogs/${blog.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-600 cursor-pointer"
            >
              <Link href={`/admin/blogs/${blog.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDeleteItemId(blog.id);
                setDeleteItemType("blog");
                setDeleteItemName(blog.title);
                setDeleteDialogOpen(true);
              }}
              className="text-destructive hover:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Function to handle bulk delete with dialog
  const handleBulkDeleteWithDialog = (
    ids: string[],
    type: "member" | "blog",
  ) => {
    setDeleteItemId(ids.join(",")); // Store multiple IDs as a comma-separated string
    setDeleteItemType(`${type}-bulk` as "member-bulk" | "blog-bulk"); // Mark as bulk operation
    setDeleteItemName(`${ids.length} ${type}${ids.length > 1 ? "s" : ""}`);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Members Management</h2>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {members.length} members
                </p>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={memberColumns}
                  data={members}
                  searchKey="name"
                  placeholder="Search members..."
                  onBulkDelete={(ids) =>
                    handleBulkDeleteWithDialog(ids, "member")
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Blogs Management</h2>
              <Button className="cursor-pointer" asChild>
                <Link href="/admin/blogs/new" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blog
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blogs List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {blogs.length} blogs
                </p>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={blogColumns}
                  data={blogs}
                  searchKey="title"
                  placeholder="Search blogs..."
                  onBulkDelete={(ids) =>
                    handleBulkDeleteWithDialog(ids, "blog")
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                {deleteItemType === "member-bulk" ||
                deleteItemType === "blog-bulk"
                  ? `Are you sure you want to delete ${deleteItemName}? This action cannot be undone.`
                  : `Are you sure you want to delete ${deleteItemName}? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteItemType === "member-bulk" && deleteItemId) {
                    // Handle bulk delete for members
                    const ids = deleteItemId.split(",");
                    handleBulkDeleteMembers(ids);
                    setDeleteDialogOpen(false);
                  } else if (deleteItemType === "blog-bulk" && deleteItemId) {
                    // Handle bulk delete for blogs
                    const ids = deleteItemId.split(",");
                    handleBulkDeleteBlogs(ids);
                    setDeleteDialogOpen(false);
                  } else if (
                    deleteItemType === "member" &&
                    deleteItemId &&
                    !deleteItemId.includes(",")
                  ) {
                    // Handle single member delete
                    handleDeleteMember(deleteItemId);
                    setDeleteDialogOpen(false);
                  } else if (
                    deleteItemType === "blog" &&
                    deleteItemId &&
                    !deleteItemId.includes(",")
                  ) {
                    // Handle single blog delete
                    handleDeleteBlog(deleteItemId);
                    setDeleteDialogOpen(false);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
