cmake_minimum_required(VERSION 3.10)

project(UraniumTK VERSION 1.0)

add_executable(Uranium.Toolkit)
set_target_properties(Uranium.Toolkit PROPERTIES OUTPUT_NAME ../UraniumTK)

target_sources(Uranium.Toolkit PRIVATE)

include(Sources.cmake)
