<template>
  <div class="grading-page">
    <!-- Sidebar / Dashboard Area -->
    <dashPageView />

    <!-- Main Content -->
    <div class="grading-content">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h2>Grading System</h2>
          <p>Manage your grading rules and grade points</p>
        </div>

        <button class="btn btn-primary add-btn" @click="openAddModal">
          <i class="bi bi-plus-lg me-2"></i>
          Add Grade
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-box">
        <div class="spinner-border text-primary" role="status"></div>

        <span>Loading grading system...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="gradingSystems.length === 0" class="empty-box">
        <div class="empty-icon">
          <i class="bi bi-bar-chart"></i>
        </div>

        <h5>No grading rules found</h5>

        <p>Add your first grading rule to get started.</p>

        <button class="btn btn-primary" @click="openAddModal">
          <i class="bi bi-plus-lg me-2"></i>
          Add Grade
        </button>
      </div>

      <!-- Grading Table -->
      <div v-else class="grading-card">
        <div class="card-header-custom">
          <div>
            <h5>Grading Rules</h5>
            <span> {{ gradingSystems.length }} grading rules </span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table grading-table align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Minimum Percentage</th>
                <th>Range</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(grading, index) in gradingSystems" :key="grading.id">
                <td>
                  <span class="serial">
                    {{ index + 1 }}
                  </span>
                </td>

                <!-- Grade -->
                <td>
                  <span class="grade-badge" :class="getGradeClass(grading.grade)">
                    {{ grading.grade }}
                  </span>
                </td>

                <!-- Point -->
                <td>
                  <strong class="point-value">
                    {{ formatPoint(grading.grade_point) }}
                  </strong>
                </td>

                <!-- Minimum Percentage -->
                <td>
                  <strong> {{ formatPercentage(grading.min_percentage) }}% </strong>
                </td>

                <!-- Range -->
                <td>
                  <span class="range-text">
                    {{ getRange(grading) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="text-end">
                  <div class="action-buttons">
                    <button
                      class="action-btn edit-btn"
                      title="Edit"
                      @click="openEditModal(grading)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                      class="action-btn delete-btn"
                      title="Delete"
                      @click="deleteGrade(grading)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showModal" class="modal-backdrop-custom" @click.self="closeModal">
      <div class="grading-modal">
        <!-- Modal Header -->
        <div class="modal-header-custom">
          <div>
            <h5>
              {{ isEditMode ? 'Edit Grade' : 'Add Grade' }}
            </h5>

            <p>
              {{ isEditMode ? 'Update grading rule information' : 'Create a new grading rule' }}
            </p>
          </div>

          <button class="close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveGrade">
          <div class="modal-body-custom">
            <!-- Grade -->
            <div class="form-group">
              <label>
                Grade
                <span>*</span>
              </label>

              <input
                v-model="form.grade"
                type="text"
                class="form-control custom-input"
                placeholder="Example: A+"
                maxlength="10"
                required
              />
            </div>

            <!-- Grade Point -->
            <div class="form-group">
              <label>
                Grade Point
                <span>*</span>
              </label>

              <input
                v-model="form.grade_point"
                type="number"
                class="form-control custom-input"
                placeholder="Example: 5.00"
                min="0"
                max="5"
                step="0.01"
                required
              />
            </div>

            <!-- Minimum Percentage -->
            <div class="form-group">
              <label>
                Minimum Percentage
                <span>*</span>
              </label>

              <div class="percentage-input">
                <input
                  v-model="form.min_percentage"
                  type="number"
                  class="form-control custom-input"
                  placeholder="Example: 80"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />

                <span>%</span>
              </div>
            </div>

            <!-- Preview -->
            <div class="preview-box">
              <div class="preview-title">
                <i class="bi bi-eye me-2"></i>
                Preview
              </div>

              <div class="preview-content">
                <span class="grade-badge" :class="getGradeClass(form.grade)">
                  {{ form.grade || 'A+' }}
                </span>

                <span>
                  Grade Point:
                  <strong>
                    {{ form.grade_point || '5.00' }}
                  </strong>
                </span>

                <span>
                  Minimum:
                  <strong> {{ form.min_percentage || '80' }}% </strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer-custom">
            <button type="button" class="btn btn-light cancel-btn" @click="closeModal">
              Cancel
            </button>

            <button type="submit" class="btn btn-primary save-btn" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>

              {{ saving ? 'Saving...' : isEditMode ? 'Update Grade' : 'Save Grade' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dashPageView from './dashPageView.vue'
import api from '@/services/api'

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const gradingSystems = ref([])

const loading = ref(false)

const saving = ref(false)

const showModal = ref(false)

const isEditMode = ref(false)

const editingId = ref(null)

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = ref({
  grade: '',
  grade_point: '',
  min_percentage: '',
})

/*
|--------------------------------------------------------------------------
| Load Grading Systems
|--------------------------------------------------------------------------
*/

const fetchGradingSystems = async () => {
  loading.value = true

  try {
    const response = await api.get('/grading-systems')

    gradingSystems.value = response.data?.data || []
  } catch (error) {
    console.error('Failed to load grading systems:', error)

    alert(error.response?.data?.message || 'Failed to load grading systems.')
  } finally {
    loading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Open Add Modal
|--------------------------------------------------------------------------
*/

const openAddModal = () => {
  isEditMode.value = false

  editingId.value = null

  form.value = {
    grade: '',
    grade_point: '',
    min_percentage: '',
  }

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| Open Edit Modal
|--------------------------------------------------------------------------
*/

const openEditModal = (grading) => {
  isEditMode.value = true

  editingId.value = grading.id

  form.value = {
    grade: grading.grade,
    grade_point: grading.grade_point,
    min_percentage: grading.min_percentage,
  }

  showModal.value = true
}

/*
|--------------------------------------------------------------------------
| Close Modal
|--------------------------------------------------------------------------
*/

const closeModal = () => {
  if (saving.value) {
    return
  }

  showModal.value = false
}

/*
|--------------------------------------------------------------------------
| Save / Update Grade
|--------------------------------------------------------------------------
*/

const saveGrade = async () => {
  saving.value = true

  try {
    const payload = {
      grade: form.value.grade,
      grade_point: Number(form.value.grade_point),
      min_percentage: Number(form.value.min_percentage),
    }

    if (isEditMode.value) {
      await api.put(`/grading-systems/${editingId.value}`, payload)
    } else {
      await api.post('/grading-systems', payload)
    }

    await fetchGradingSystems()

    closeModal()
  } catch (error) {
    console.error('Failed to save grading system:', error)

    alert(error.response?.data?.message || 'Failed to save grading system.')
  } finally {
    saving.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Delete Grade
|--------------------------------------------------------------------------
*/

const deleteGrade = async (grading) => {
  const confirmed = window.confirm(`Are you sure you want to delete grade "${grading.grade}"?`)

  if (!confirmed) {
    return
  }

  try {
    await api.delete(`/grading-systems/${grading.id}`)

    await fetchGradingSystems()
  } catch (error) {
    console.error('Failed to delete grading system:', error)

    alert(error.response?.data?.message || 'Failed to delete grading system.')
  }
}

/*
|--------------------------------------------------------------------------
| Format Point
|--------------------------------------------------------------------------
*/

const formatPoint = (value) => {
  return Number(value || 0).toFixed(2)
}

/*
|--------------------------------------------------------------------------
| Format Percentage
|--------------------------------------------------------------------------
*/

const formatPercentage = (value) => {
  return Number(value || 0)
}

/*
|--------------------------------------------------------------------------
| Grade Color Class
|--------------------------------------------------------------------------
*/

const getGradeClass = (grade) => {
  switch (String(grade || '').toUpperCase()) {
    case 'A+':
      return 'grade-a-plus'

    case 'A':
      return 'grade-a'

    case 'A-':
      return 'grade-a-minus'

    case 'B':
      return 'grade-b'

    case 'C':
      return 'grade-c'

    case 'D':
      return 'grade-d'

    case 'F':
      return 'grade-f'

    default:
      return 'grade-default'
  }
}

/*
|--------------------------------------------------------------------------
| Calculate Range
|--------------------------------------------------------------------------
*/

const getRange = (grading) => {
  const currentMin = Number(grading.min_percentage)

  const sorted = [...gradingSystems.value].sort(
    (a, b) => Number(b.min_percentage) - Number(a.min_percentage),
  )

  const currentIndex = sorted.findIndex((item) => item.id === grading.id)

  if (currentIndex === 0) {
    return `${currentMin}% - 100%`
  }

  const previous = sorted[currentIndex - 1]

  if (!previous) {
    return `${currentMin}%+`
  }

  const upperLimit = Number(previous.min_percentage) - 0.01

  return `${currentMin}% - ${upperLimit.toFixed(2)}%`
}

/*
|--------------------------------------------------------------------------
| Initial Load
|--------------------------------------------------------------------------
*/

onMounted(() => {
  fetchGradingSystems()
})
</script>

<style scoped>
.grading-page {
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

/*
|--------------------------------------------------------------------------
| Main Content
|--------------------------------------------------------------------------
*/

.grading-content {
  margin-left: 250px;
  padding: 30px;
  min-height: 100vh;
}

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
*/

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.page-header h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #172033;
}

.page-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
}

.add-btn {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
}

/*
|--------------------------------------------------------------------------
| Card
|--------------------------------------------------------------------------
*/

.grading-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(15, 23, 42, 0.04);
}

.card-header-custom {
  padding: 20px 22px;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-custom h5 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #172033;
}

.card-header-custom span {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
}

/*
|--------------------------------------------------------------------------
| Table
|--------------------------------------------------------------------------
*/

.grading-table {
  min-width: 800px;
}

.grading-table thead th {
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 15px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.grading-table tbody td {
  padding: 17px 18px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.grading-table tbody tr:last-child td {
  border-bottom: none;
}

.grading-table tbody tr:hover {
  background: #fafcff;
}

.serial {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
}

.point-value {
  color: #172033;
}

.range-text {
  color: #64748b;
  font-size: 14px;
}

/*
|--------------------------------------------------------------------------
| Grade Badge
|--------------------------------------------------------------------------
*/

.grade-badge {
  min-width: 46px;
  height: 34px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

.grade-a-plus {
  background: #dcfce7;
  color: #15803d;
}

.grade-a {
  background: #dbeafe;
  color: #1d4ed8;
}

.grade-a-minus {
  background: #e0e7ff;
  color: #4338ca;
}

.grade-b {
  background: #fef3c7;
  color: #b45309;
}

.grade-c {
  background: #ffedd5;
  color: #c2410c;
}

.grade-d {
  background: #fce7f3;
  color: #be185d;
}

.grade-f {
  background: #fee2e2;
  color: #dc2626;
}

.grade-default {
  background: #f1f5f9;
  color: #475569;
}

/*
|--------------------------------------------------------------------------
| Action Buttons
|--------------------------------------------------------------------------
*/

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.edit-btn {
  background: #eff6ff;
  color: #2563eb;
}

.edit-btn:hover {
  background: #dbeafe;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fee2e2;
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

.loading-box {
  min-height: 300px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #64748b;
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

.empty-box {
  min-height: 350px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 15px;
}

.empty-box h5 {
  margin: 0;
  color: #172033;
  font-weight: 700;
}

.empty-box p {
  margin: 8px 0 20px;
  color: #64748b;
}

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.grading-modal {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.modal-header-custom {
  padding: 22px 24px;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-header-custom h5 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #172033;
}

.modal-header-custom p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 13px;
}

.close-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 7px;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #172033;
}

.modal-body-custom {
  padding: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 7px;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.form-group label span {
  color: #dc2626;
}

.custom-input {
  height: 44px;
  border-radius: 8px;
  border: 1px solid #dbe1e8;
  box-shadow: none;
}

.custom-input:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.08);
}

.percentage-input {
  position: relative;
}

.percentage-input input {
  padding-right: 40px;
}

.percentage-input span {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 600;
}

/*
|--------------------------------------------------------------------------
| Preview
|--------------------------------------------------------------------------
*/

.preview-box {
  margin-top: 5px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.preview-title {
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #64748b;
}

/*
|--------------------------------------------------------------------------
| Modal Footer
|--------------------------------------------------------------------------
*/

.modal-footer-custom {
  padding: 17px 24px;
  border-top: 1px solid #eef0f3;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  border-radius: 8px;
  padding: 9px 18px;
  font-weight: 600;
}

.save-btn {
  min-width: 125px;
}

/*
|--------------------------------------------------------------------------
| Responsive
|--------------------------------------------------------------------------
*/

@media (max-width: 991px) {
  .grading-content {
    margin-left: 0;
    padding: 20px;
  }

  .page-header {
    gap: 15px;
    align-items: flex-start;
  }
}

@media (max-width: 576px) {
  .grading-content {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
  }

  .grading-modal {
    max-height: 95vh;
    overflow-y: auto;
  }
}
</style>
