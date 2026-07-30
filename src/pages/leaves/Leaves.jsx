import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

import LeaveTable from "../../components/leaves/LeaveTable";
import LeaveModal from "../../components/leaves/LeaveModal";
import LeaveSearch from "../../components/leaves/LeaveSearch";
import DeleteLeaveModal from "../../components/leaves/DeleteLeaveModal";

function Leave() {

    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedLeave, setSelectedLeave] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchLeaves = useCallback(async () => {

        try {

            const response = await api.get("/leaves");

            const data = response.data.data || [];

            if (search.trim() === "") {

                setLeaves(data);

            } else {

                const keyword = search.toLowerCase();

                const filtered = data.filter((leave) => {

                    const employee =
                        leave.employees?.name?.toLowerCase() || "";

                    const type =
                        leave.leave_type?.toLowerCase() || "";

                    const status =
                        leave.status?.toLowerCase() || "";

                    return (
                        employee.includes(keyword) ||
                        type.includes(keyword) ||
                        status.includes(keyword)
                    );

                });

                setLeaves(filtered);

            }

        } catch (error) {

            console.error(error);

            alert("Failed to load leave requests.");

        } finally {

            setLoading(false);

        }

    }, [search]);

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            try {
                const response = await api.get("/leaves");
                const data = response.data.data || [];
                if (!ignore) {
                    if (search.trim() === "") {
                        setLeaves(data);
                    } else {
                        const keyword = search.toLowerCase();
                        const filtered = data.filter((leave) => {
                            const employee = leave.employees?.name?.toLowerCase() || "";
                            const type = leave.leave_type?.toLowerCase() || "";
                            const status = leave.status?.toLowerCase() || "";
                            return (
                                employee.includes(keyword) ||
                                type.includes(keyword) ||
                                status.includes(keyword)
                            );
                        });
                        setLeaves(filtered);
                    }
                }
            } catch (error) {
                if (!ignore) {
                    console.error(error);
                    alert("Failed to load leave requests.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            ignore = true;
        };
    }, [search]);

    const openAddModal = () => {

        setModalMode("add");
        setSelectedLeave(null);
        setShowModal(true);

    };

    const openEditModal = (leave) => {

        setModalMode("edit");
        setSelectedLeave(leave);
        setShowModal(true);

    };

    const openDeleteModal = (leave) => {

        setSelectedLeave(leave);
        setShowDeleteModal(true);

    };

    const handleDelete = async () => {

        try {

            await api.delete(`/leaves/${selectedLeave.id}`);

            setShowDeleteModal(false);

            fetchLeaves();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete leave."
            );

        }

    };

    const getReviewerId = () => {
        try {
            const userData = localStorage.getItem("user");
            if (userData) {
                const user = JSON.parse(userData);
                return user.id || 1;
            }
        } catch {
            // fallback
        }
        return 1;
    };

    const approveLeave = async (id) => {

        try {

            await api.patch(`/leaves/${id}/status`, {
                status: "approved",
                reviewed_by: getReviewerId()
            });

            fetchLeaves();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to approve leave."
            );

        }

    };

    const rejectLeave = async (id) => {

        try {

            await api.patch(`/leaves/${id}/status`, {
                status: "rejected",
                reviewed_by: getReviewerId()
            });

            fetchLeaves();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to reject leave."
            );

        }

    };

    return (

        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                    Leave Management
                </h1>

                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Leave
                </button>

            </div>

            <LeaveSearch
                search={search}
                setSearch={setSearch}
            />

            <LeaveTable
                leaves={leaves}
                loading={loading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onApprove={approveLeave}
                onReject={rejectLeave}
            />

            <LeaveModal
                open={showModal}
                mode={modalMode}
                leave={selectedLeave}
                onClose={() => setShowModal(false)}
                onSuccess={() => {

                    setShowModal(false);
                    fetchLeaves();

                }}
            />

            <DeleteLeaveModal
                open={showDeleteModal}
                leave={selectedLeave}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDelete}
            />

        </div>

    );

}

export default Leave;