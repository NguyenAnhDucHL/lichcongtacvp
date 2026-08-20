using System.Collections.Generic;
using LichCongTacVanPhong.Models;

namespace LichCongTacVanPhong.Core.Data.Interfaces
{
    public interface IAdminRepository
    {
        List<Department> GetDepartments();
        int InsertDepartment(Department dept);
        void UpdateDepartment(Department dept);
        void DeleteDepartment(int id);
    }
}
