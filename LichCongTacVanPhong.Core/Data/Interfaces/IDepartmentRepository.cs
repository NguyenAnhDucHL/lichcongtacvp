using System.Collections.Generic;
using LichCongTacVanPhong.Models;

namespace LichCongTacVanPhong.Core.Data.Interfaces
{
    public interface IDepartmentRepository
    {
        List<Department> GetAll();
        Department? GetById(int id);
        bool Create(Department department);
        bool Update(Department department);
        bool Delete(int id);
    }
}
