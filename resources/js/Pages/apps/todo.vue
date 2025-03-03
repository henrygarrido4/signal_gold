<script>
import Layout from "@/Layouts/main.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import Swal from "sweetalert2";
import { todoList } from "@/common/data";
import simplebar from "simplebar-vue";
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import draggable from 'vuedraggable';
import { BTooltip } from "bootstrap-vue-next";

import avatar1 from "@assets/images/users/avatar-1.jpg";
import avatar2 from "@assets/images/users/avatar-2.jpg";
import avatar3 from "@assets/images/users/avatar-3.jpg";
import avatar4 from "@assets/images/users/avatar-4.jpg";
import avatar5 from "@assets/images/users/avatar-5.jpg";
import avatar6 from "@assets/images/users/avatar-6.jpg";
import avatar7 from "@assets/images/users/avatar-7.jpg";
import avatar8 from "@assets/images/users/avatar-8.jpg";
import avatar9 from "@assets/images/users/avatar-9.jpg";
import avatar10 from "@assets/images/users/avatar-10.jpg";

export default {
    props: {
        tasks: {
            type: Array,
            required: true
        },
        projects: {
            type: Array,
            required: true
        },
        users: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            projectModal: false,
            taskModal: false,
            editFlag: false,
            searchQuery: null,
            selectedProject: null,
            form: useForm({
                id: null,
                title: '',
                description: '',
                project_id: '',
                assigned_user_ids: [],
                due_date: null,
                priority: '',
                status: ''
            }),
            filters: {
                status: 'all',
                project: null
            },
            todoList: todoList,
            value: null,
            statusvalue: null,
            priorityvalue: null,
            selectedimage: [],
            options: [
                { name: 'James Forbes', value: avatar2},
                { name: 'John Robles', value: avatar3},
                { name: 'Mary Gant', value: avatar4},
                { name: 'Curtis Saenz', value: avatar1},
                { name: 'Virgie Price', value: avatar5},
                { name: 'Anthony Mills', value: avatar10},
                { name: 'Marian Angel', value: avatar6},
                { name: 'Johnnie Walton', value: avatar7},
                { name: 'Donna Weston', value: avatar8},
                { name: 'Diego Norris', value: avatar9},
            ],
            projectForm: useForm({
                name: ''
            }),
            formSubmitted: false,
        };
    },
    components: {
        Layout,
        flatPickr,
        Multiselect,
        simplebar,
        draggable,
        BTooltip
    },
    watch: {
        todoList() { },
        selectedimage() { },
    },
    computed: {
        filteredTasks() {
            let filtered = this.tasks;

            if (this.searchQuery) {
                const search = this.searchQuery.toLowerCase();
                filtered = filtered.filter(task => 
                    task.title.toLowerCase().includes(search) ||
                    task.description?.toLowerCase().includes(search) ||
                    task.project.name.toLowerCase().includes(search) ||
                    task.creator.name.toLowerCase().includes(search) ||
                    (task.assignedUsers && task.assignedUsers.some(user => 
                        user.name.toLowerCase().includes(search)
                    ))
                );
            }

            if (this.filters.status !== 'all') {
                filtered = filtered.filter(task => task.status === this.filters.status);
            }

            if (this.filters.project) {
                filtered = filtered.filter(task => task.project.id === this.filters.project);
            }

            return filtered;
        }
    },
    methods: {
        deletedata(event) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#f46a6a",
                confirmButtonColor: "#34c38f",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.value) {
                    this.todoList.splice(this.todoList.indexOf(event), 1);
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
        },
        createTask() {
            this.formSubmitted = false;
            this.form.clearErrors();
            // console.log('Creating task...');
            this.editFlag = false;
            this.form.id = null;
            this.form.title = '';
            this.form.description = '';
            this.form.project_id = this.selectedProject || '';
            this.form.assigned_user_ids = [];
            this.form.due_date = null;
            this.form.priority = '';
            this.form.status = '';
            
            this.taskModal = true;
            // console.log('Available users:', JSON.parse(JSON.stringify(this.users)));
        },

        editTask(task) {
            this.formSubmitted = false;
            this.form.clearErrors();
            this.editFlag = true;
            this.form.id = task.id;
            this.form.title = task.title;
            this.form.description = task.description;
            this.form.project_id = { value: task.project.id, label: task.project.name };
            this.form.assigned_user_ids = task.assigned_users.map(user => user.id);
            this.form.due_date = task.due_date;
            this.form.priority = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
            this.form.status = task.status === 'in_progress' ? 'Inprogress' : 
                task.status.charAt(0).toUpperCase() + task.status.slice(1);
            
            // console.log('Editing task:', this.form);
            this.taskModal = true;
        },

        submitTask() {
            this.formSubmitted = true;

            // Format the status and priority values for the backend
            const formData = {
                ...this.form,
                status: this.form.status?.toLowerCase().replace('inprogress', 'in_progress'),
                priority: this.form.priority?.toLowerCase(),
                project_id: this.form.project_id?.value || this.form.project_id
            };

            if (this.editFlag) {
                formData.put(route('tasks.update', this.form.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        this.taskModal = false;
                        this.form.reset();
                        this.editFlag = false;
                        this.formSubmitted = false;
                    },
                    onError: (errors) => {
                        console.error('Task update errors:', errors);
                        // If you want to show the error message to the user
                        Swal.fire({
                            icon: 'error',
                            title: 'Validation Error',
                            text: 'Please check all required fields'
                        });
                    }
                });
            } else {
                formData.post(route('tasks.store'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        this.taskModal = false;
                        this.form.reset();
                        this.formSubmitted = false;
                    },
                    onError: (errors) => {
                        console.error('Task creation errors:', errors);
                        // If you want to show the error message to the user
                        Swal.fire({
                            icon: 'error',
                            title: 'Validation Error',
                            text: 'Please check all required fields'
                        });
                    }
                });
            }
        },

        deleteTask(task) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.value) {
                    router.delete(route('tasks.destroy', task.id), {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire(
                                'Deleted!',
                                'Task has been deleted.',
                                'success'
                            );
                        },
                        onError: () => {
                            Swal.fire(
                                'Error!',
                                'Failed to delete task.',
                                'error'
                            );
                        }
                    });
                }
            });
        },

        updateTaskStatus(task, status) {
            // console.log('Updating status:', { taskId: task.id, status: status });
            router.put(route('tasks.update-status', task.id), {
                status: status
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Task status updated',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                onError: (errors) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update task status!'
                    });
                }
            });
        },
        create() {
            this.createTask();
        },

        editdata(item) {
            this.taskModal = true;
            this.value = null;
            this.selectedimage = [];
            document.querySelector(".task-modal").innerHTML = "Edit Task";
            document.getElementById("addNewTodo").innerHTML = "Save";
            document.getElementById("taskid-input").value = item.id;
            var editimage = [];
            item.assignedto.map(function (item) {
                editimage.push(item.assigneeImg ? item.assigneeImg : item);
            });
            this.selectedimage = editimage;
            document.getElementById("task-title-input").value = item.todo;
            document.getElementById("task-duedate-input").value = item.dueDate;
            this.statusvalue = item.status;
            this.priorityvalue = item.priority;

        },
        loadList() {
            document.getElementById("elmLoader").innerHTML = '';
        },
        load(manyTodos) {
            this.loadList(manyTodos);
        },
        fetchIdFromObj(todo) {
            return parseInt(todo.id);
        },
        sortElementsById() {
            var manyTodos = this.todoList.sort(function (a, b) {
                var x = parseInt(a.id);
                var y = parseInt(b.id);

                if (x > y) {
                    return -1;
                }
                if (x < y) {
                    return 1;
                }
                return 0;
            });
            this.load(manyTodos);
        },

        todoListStatus(e) {
            var todo = this.todoList;
            todo.filter(function (orders) {
                if (orders.id == e.target.id) {
                    if (orders.status == 'Completed') {
                        orders.status = 'Inprogress';
                    } else {
                        orders.status = 'Completed';
                    }
                }
            });
        },

        submitProject() {
            this.projectForm.post(route('todo-projects.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    this.projectModal = false;
                    this.projectForm.reset();
                },
                onError: () => {
                    // Error handling is automatic with useForm
                }
            });
        },

        selectProject(projectId) {
            this.selectedProject = projectId;
            // Filter tasks by project
            this.filters.project = projectId;
        },

        // Add a method to handle user selection
        onUserSelect(selectedValues) {
            // console.log('Selected values:', selectedValues);
            this.form.assigned_user_ids = selectedValues;
        },

        getStatusVariant(status) {
            const variants = {
                'new': 'info',
                'in_progress': 'warning',
                'pending': 'secondary',
                'completed': 'success'
            };
            return variants[status] || 'primary';
        },

        getPriorityVariant(priority) {
            const variants = {
                'high': 'danger',
                'medium': 'warning',
                'low': 'success'
            };
            return variants[priority] || 'primary';
        },

        formatStatus(status) {
            if (!status) return '';
            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        },

        onDragEnd(event) {
            // Make sure we have both oldIndex and newIndex
            if (typeof event.oldIndex === 'undefined' || typeof event.newIndex === 'undefined') return;
            
            const tasks = this.filteredTasks.map((task, index) => ({
                id: task.id,
                order: index
            }));

            router.put(route('tasks.reorder'), { tasks }, {
                preserveScroll: true,
                onError: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to update task order!'
                    });
                }
            });
        },

        deleteProject(project) {
            Swal.fire({
                title: "Are you sure?",
                text: "This will delete the project and all its tasks. You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.value) {
                    router.delete(route('todo-projects.destroy', project.id), {
                        preserveScroll: true,
                        onSuccess: () => {
                            // Clear selected project if it was the deleted one
                            if (this.selectedProject === project.id) {
                                this.selectedProject = null;
                                this.filters.project = null;
                            }
                            Swal.fire(
                                'Deleted!',
                                'Project and its tasks have been deleted.',
                                'success'
                            );
                        },
                        onError: () => {
                            Swal.fire(
                                'Error!',
                                'Failed to delete project.',
                                'error'
                            );
                        }
                    });
                }
            });
        },
    },
    mounted() {
        // console.log('Tasks data:', JSON.parse(JSON.stringify(this.tasks)));
        // console.log('Component mounted. Users:', JSON.parse(JSON.stringify(this.users)));
        var addNewProject = document.getElementById('addNewProject');
        if (addNewProject) {
            document.getElementById("addNewProject").addEventListener("click", function () {
                var projectName = document.getElementById("projectname-input").value;
                var uniqueid = Math.floor(Math.random() * 100);
                const projectlisthtml =
                    '<li id="projectlist-' + uniqueid + '">\
                        <BLink data-bs-toggle="collapse" href="#projectCollapse-'+ uniqueid + '" class="nav-link fs-13">' + projectName + '</BLink>\
                        <div class="collapse" id="projectCollapse-'+ uniqueid + '">\
                            <ul class="mb-0 sub-menu list-unstyled ps-3 vstack gap-2 mb-2">\
                                <li>\
                                    <BLink href="#!"><i class="ri-stop-mini-fill align-middle fs-15 text-danger"></i> v1.0.0</BLink>\
                                </li>\
                            </ul>\
                        </div>\
                    </li>';

                if (projectName !== "") {
                    var projectListdata = document.getElementById("projectlist-data");
                    projectListdata.insertAdjacentHTML("beforeend", projectlisthtml);
                    var addProjectClose = document.getElementById("addProjectBtn-close");
                    addProjectClose.click();
                    document.getElementById('projectForm').reset();
                }
            });
        }
        this.sortElementsById();
    },

};
</script>

<template>
    <Layout>

        <div class="chat-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            <div class="file-manager-sidebar">
                <div class="p-4 d-flex flex-column h-100">
                    <div class="mb-3">
                        <BButton variant="success" class="w-100" @click="projectModal = !projectModal"><i
                                class="ri-add-line align-bottom"></i> Add Project</BButton>
                    </div>

                    <simplebar class="px-4 mx-n4" data-simplebar style="height: calc(100vh - 468px);">
                        <div class="to-do-menu mb-3">
                            <ul class="list-unstyled file-manager-menu to-do-menu">
                                <li v-for="project in projects" :key="project.id">
                                    <a 
                                        href="javascript:void(0);" 
                                        :class="{ 'active': selectedProject === project.id }"
                                        @click="selectProject(project.id)"
                                        class="d-flex align-items-center justify-content-between"
                                    >
                                        <div class="d-flex align-items-center flex-grow-1">
                                            <i class="ri-projector-2-line me-2"></i>
                                            <span class="flex-grow-1">{{ project.name }}</span>
                                        </div>
                                        <div class="btn-icon btn-sm btn-ghost-danger ms-2" @click.stop="deleteProject(project)">
                                            <i class="ri-delete-bin-5-line"></i>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </simplebar>


                    <div class="mt-auto text-center">
                        <img src="@assets/images/task.png" alt="Task" class="img-fluid" />
                    </div>
                </div>
            </div>
            <!--end side content-->
            <div class="file-manager-content w-100 p-4 pb-0">
                <BRow class="mb-4">
                    <div order="1" class="col-auto d-block d-lg-none">
                        <BButton variant="btn-soft-success" class="btn btn-icon btn-sm fs-16 file-menu-btn">
                            <i class="ri-menu-2-fill align-bottom"></i>
                        </BButton>
                    </div>
                    <BCol order="3" order-sm="2" class="mt-3 mt-sm-0" sm>
                        <h5 class="fw-semibold mb-0">Signal Dashboard <span
                                class="badge bg-primary align-bottom ms-2">v1.0.0</span></h5>
                    </BCol>

                    <BCol order="2" order-sm="3" class="col-auto ms-auto">
                        <div class="hstack gap-2">
                            <BButton-group>
                                <BButton variant="soft-danger" class="btn btn-icon fw-semibold"><i
                                        class="ri-arrow-go-back-line"></i></BButton>
                                <BButton variant="soft-success" class="btn btn-icon fw-semibold"><i
                                        class="ri-arrow-go-forward-line"></i></BButton>
                            </BButton-group>
                        </div>
                    </BCol>
                </BRow>
                <div class="p-3 bg-light rounded mb-4">
                    <BRow class="g-2">
                        <BCol lg="auto">
                            <select class="form-control" data-choices data-choices-search-false name="choices-select-status"
                                id="choices-select-status" v-model="filters.status">
                                <option value="all">All Tasks</option>
                                <option value="completed">Completed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="new">New</option>
                            </select>
                        </BCol>
                        <BCol lg>
                            <div class="search-box">
                                <input type="text" id="searchTaskList" class="form-control search"
                                    placeholder="Search task name" v-model="searchQuery">
                                <i class="ri-search-line search-icon"></i>
                            </div>
                        </BCol>
                        <BCol lg="auto">
                            <BButton variant="primary" class="createTask" @click="create"> <i
                                    class="ri-add-fill align-bottom"></i> Add Tasks
                            </BButton>
                        </BCol>
                    </BRow>
                </div>

                <div class="todo-content position-relative px-4 mx-n4" id="todo-content">
                    <div id="elmLoader">
                        <div class="spinner-border text-primary avatar-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div class="todo-task" id="todo-task">
                        <div class="table-responsive">
                            <table class="table align-middle position-relative table-nowrap">
                                <thead class="table-active">
                                    <tr>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">Project</th>
                                        <th scope="col">Assigned</th>
                                        <th scope="col">Due Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Priority</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>

                                <draggable 
                                    tag="tbody"
                                    :list="filteredTasks"
                                    handle=".task-handle"
                                    @end="onDragEnd"
                                    item-key="id"
                                    id="task-lists"
                                    :animation="200"
                                    ghost-class="ghost"
                                    drag-class="drag"
                                >
                                    <template #item="{ element: task }">
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-start">
                                                    <div class="flex-shrink-0 me-3">
                                                        <div class="task-handle px-1 bg-light rounded cursor-move">: :</div>
                                                    </div>
                                                    <div class="flex-grow-1">
                                                        <div class="form-check">
                                                            <input 
                                                                class="form-check-input" 
                                                                type="checkbox"
                                                                :checked="task.status === 'completed'"
                                                                @click="updateTaskStatus(task, task.status === 'completed' ? 'in_progress' : 'completed')"
                                                            >
                                                            <label class="form-check-label ms-1">
                                                                {{ task.title }}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ task.project.name }}</td>
                                            <td>
                                                <div class="avatar-group">
                                                    <div v-for="(user, index) in task.assigned_users" 
                                                         :key="index"
                                                         class="avatar-group-item">
                                                        <div class="d-inline-block"
                                                             :id="`task-member-${task.id}-${index}`">
                                                            <div class="avatar-xxs">
                                                                <img v-if="user.avatar" 
                                                                     :src="user.avatar" 
                                                                     :alt="user.name"
                                                                     class="rounded-circle img-fluid" 
                                                                     @error="$event.target.src = '/images/users/avatar-1.jpg'" />
                                                                <span v-else 
                                                                      class="avatar-title rounded-circle bg-primary text-white">
                                                                    {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <BTooltip 
                                                            :target="`task-member-${task.id}-${index}`" 
                                                            placement="top"
                                                            :delay="{ show: 50, hide: 50 }"
                                                            class="text-nowrap">
                                                            {{ user.name }}
                                                        </BTooltip>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ task.due_date }}</td>
                                            <td>
                                                <BBadge 
                                                    :variant="getStatusVariant(task.status)" 
                                                    class="text-uppercase"
                                                >
                                                    {{ formatStatus(task.status) }}
                                                </BBadge>
                                            </td>
                                            <td>
                                                <BBadge 
                                                    :variant="getPriorityVariant(task.priority)" 
                                                    class="text-uppercase"
                                                >
                                                    {{ task.priority }}
                                                </BBadge>
                                            </td>
                                            <td>
                                                <div class="hstack gap-2">
                                                    <BButton 
                                                        variant="soft-danger" 
                                                        size="sm" 
                                                        @click="deleteTask(task)"
                                                    >
                                                        <i class="ri-delete-bin-5-fill align-bottom"></i>
                                                    </BButton>
                                                    <BButton 
                                                        variant="soft-info" 
                                                        size="sm" 
                                                        @click="editTask(task)"
                                                    >
                                                        <i class="ri-pencil-fill align-bottom"></i>
                                                    </BButton>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </draggable>
                            </table>
                        </div>
                    </div>
                    <div class="py-4 mt-4 text-center" id="noresult" style="display: none;">
                        <i class="ri-search-line text-primary" style="font-size: 48px;"></i>
                        <h5 class="mt-4">Sorry! No Result Found</h5>
                    </div>
                </div>

            </div>
        </div>

        <BModal v-model="projectModal" hide-footer title="Create Project" class="v-modal-custom" modal-class="zoomIn"
            centered header-class="p-3 bg-success-subtle">
            <form @submit.prevent="submitProject" class="needs-validation">
                <div class="mb-4">
                    <label class="form-label">Project Name</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="projectForm.name"
                        :class="{ 'is-invalid': projectForm.errors.name }"
                        placeholder="Enter project name" 
                    />
                    <div v-if="projectForm.errors.name" class="invalid-feedback">
                        {{ projectForm.errors.name }}
                    </div>
                </div>
                <div class="hstack gap-2 justify-content-end">
                    <BButton 
                        type="button" 
                        variant="light" 
                        @click="projectModal = false"
                    >
                        Close
                    </BButton>
                    <BButton 
                        type="submit" 
                        variant="primary"
                        :disabled="projectForm.processing"
                    >
                        {{ projectForm.processing ? 'Creating...' : 'Create Project' }}
                    </BButton>
                </div>
            </form>
        </BModal>

        <BModal v-model="taskModal" hide-footer :title="editFlag ? 'Edit Task' : 'Create Task'" class="v-modal-custom" modal-class="zoomIn" centered header-class="p-3 bg-success-subtle">
            <form @submit.prevent="submitTask">
              

                <div class="mb-3" v-if="!selectedProject">
                    <label for="project-select" class="form-label">Project</label>
                    <Multiselect
                        v-model="form.project_id" 
                        placeholder="select project"
                        :options="projects.map(p => ({ value: p.id, label: p.name }))"
                        track-by="value"
                        label="label"
                        required
                    />
                    <div v-if="form.errors.project_id" class="invalid-feedback">
                        {{ form.errors.project_id }}
                    </div>
                </div>

                <div class="mb-3">
                    <label for="task-title-input" class="form-label">Task Title</label>
                    <input 
                        type="text" 
                        id="task-title-input"
                        class="form-control" 
                        v-model="form.title"
                        :class="{ 'is-invalid': form.errors.title || (!form.title && formSubmitted) }"
                        placeholder="Enter task title" 
                        autocomplete="off"
                        required
                    >
                    <div class="invalid-feedback">
                        {{ form.errors.title || 'Please enter a task title' }}
                    </div>
                </div>

                <div class="mb-3 position-relative">
                    <label class="form-label">Assigned To</label>
                    <div class="avatar-group justify-content-center mb-2" v-if="form.assigned_user_ids.length">
                        <div v-for="userId in form.assigned_user_ids" :key="userId" 
                             class="avatar-group-item">
                            <div class="d-inline-block" :id="`selected-user-${userId}`">
                                <div class="avatar-xs">
                                    <img 
                                        :src="users.find(u => u.id === userId)?.avatar" 
                                        :alt="users.find(u => u.id === userId)?.name"
                                        class="rounded-circle img-fluid" 
                                        @error="$event.target.src = '/images/users/avatar-1.jpg'" 
                                    />
                                </div>
                            </div>
                            <BTooltip  
                                class="text-nowrap"
                                :target="`selected-user-${userId}`" 
                                placement="top"
                                :delay="{ show: 50, hide: 50 }"
                            >
                                {{ users.find(u => u.id === userId)?.name }}
                            </BTooltip>
                        </div>
                    </div>

                    <Multiselect
                        v-model="form.assigned_user_ids"
                        :options="users"
                        :multiple="true"
                        :searchable="true"
                        track-by="id"
                        value-prop="id"
                        label="name"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :preserve-search="true"
                        placeholder="Select users"
                        :preselect-first="false"
                        mode="tags"
                        @update:model-value="onUserSelect"
                        :class="{ 'is-invalid': form.errors.assigned_user_ids }"
                        required
                    >
                        <template #option="{ option }">
                            <div class="d-flex align-items-center">
                                <img :src="option.avatar" class="avatar-xxs rounded-circle me-1" />
                                <span>{{ option.name }}</span>
                            </div>
                        </template>
                        <template #tag="{ option, handleTagRemove }">
                            <div class="multiselect-tag is-user">
                                <img :src="option.avatar" class="avatar-xxs rounded-circle me-1" />
                                <span>{{ option.name }}</span>
                                <span 
                                    class="multiselect-tag-remove" 
                                    @click="handleTagRemove(option, $event)"
                                >
                                    ×
                                </span>
                            </div>
                        </template>
                        <template v-slot="{ values, isOpen }">
                            <span class="multiselect__single" v-if="values.length && !isOpen">
                                Assigned To <b>{{ values.length }}</b> Members
                            </span>
                        </template>
                    </Multiselect>
                </div>

                <BRow class="g-4 mb-3">
                    <BCol lg="6">
                        <label for="task-status" class="form-label">Status</label>
                        <Multiselect
                            placeholder="select status"
                            v-model="form.status"
                            :options="['New', 'Inprogress', 'Pending', 'Completed']"
                        />
                    </BCol>

                    <BCol lg="6">
                        <label for="priority-field" class="form-label">Priority</label>
                        <Multiselect
                            placeholder="select priority"
                            v-model="form.priority"
                            :options="['High', 'Medium', 'Low']"
                        />
                    </BCol>
                </BRow>

                <div class="mb-4">
                    <label for="task-duedate-input" class="form-label">Due Date:</label>
                    <flat-pickr
                        v-model="form.due_date"
                        class="form-control"
                        :class="{ 'is-invalid': form.errors.due_date || (!form.due_date && formSubmitted) }"
                        id="task-duedate-input"
                        :config="{ 
                            dateFormat: 'Y-m-d',
                            altInput: true,
                            altFormat: 'F j, Y',
                            required: true
                        }"
                        placeholder="Select due date"
                    />
                    <div class="invalid-feedback">
                        {{ form.errors.due_date || 'Please select a due date' }}
                    </div>
                </div>

                <div class="hstack gap-2 justify-content-end">
                    <BButton 
                        type="button" 
                        variant="ghost-success"
                        class="d-flex align-items-center"
                        @click="taskModal = false"
                    >
                        <i class="ri-close-fill align-bottom me-1"></i> Close
                    </BButton>
                    <BButton 
                        type="submit" 
                        variant="primary" 
                        class="d-flex align-items-center"
                        :disabled="form.processing"
                    >
                        <i class="ri-add-fill align-bottom me-1"></i>
                        {{ form.processing ? 'Saving...' : (editFlag ? 'Update Task' : 'Add Task') }}
                    </BButton>
                </div>
            </form>
        </BModal>

     
    </Layout>
</template>

<style scoped>
.to-do-menu .list-unstyled li a {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background-color: var(--vz-light);
    color: var(--vz-body-color);
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    transition: all 0.3s;
}

.to-do-menu .list-unstyled li a:hover {
    border-radius: 4px;
    color: #3cd188;
}

.to-do-menu .list-unstyled li a.active {
    color: #3cd188;
}

.to-do-menu .list-unstyled li a i {
    font-size: 16px;
}

.btn-icon {
    opacity: 0.6;
    transition: opacity 0.2s;
}

.to-do-menu .list-unstyled li a:hover .btn-icon {
    opacity: 1;
}
</style>


